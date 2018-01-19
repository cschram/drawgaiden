import * as Canvas from 'canvas';
import * as Hapi from 'hapi';
import config from '../lib/config';
import { Connection, connect } from '../lib/db';
import { createLogger } from '../lib/logger';
import { HealthMonitor } from '../lib/healthmonit';
import * as DrawGaiden from '@drawgaiden/common';
// This needs to be managed better...
import { Tool } from '@drawgaiden/easel/lib/tools/tool';
import CircleTool from '@drawgaiden/easel/lib/tools/circle';
import ColorPickerTool from '@drawgaiden/easel/lib/tools/colorpicker';
import EraserTool from '@drawgaiden/easel/lib/tools/eraser';
import PencilTool from '@drawgaiden/easel/lib/tools/pencil';
import RectangleTool from '@drawgaiden/easel/lib/tools/rectangle';
import { Layer } from '@drawgaiden/easel/lib/util';

const logger = createLogger('janitor');
const server = new Hapi.Server();
server.connection({
    port: config.janitor.monitorPort
});
const monitor = new HealthMonitor(server);
server.start();

function reportError(error: any) {
    if (error.stack) {
        logger.error(error.stack);
    } else {
        logger.error(error);
    }
}

async function cleanUpCanvas(conn: Connection, id: string): Promise<boolean> {
    let userCount = await conn.getUserCount(id);
    if (userCount === 0) {
        let lastEntry = await conn.getLastHistoryEntry(id);
        let age = Date.now() - lastEntry.timestamp;
        if (age >= config.janitor.canvasExpirationAge) {
            logger.info(`Removing expired canvas "${id}"`);
            await conn.deleteCanvas(id);
            return true;
        }
    }
    return false;
}

// Squash a canvases history into a snapshot.
async function squash(conn: Connection, canvasID: string) {
    const canvasInfo: DrawGaiden.Canvas = await conn.getCanvas(canvasID) as any; // Can't coerce Cursor into CanvasInfo...
    const layers: Layer[] = [];
    for (let i = 0; i < canvasInfo.layers; i++) {
        const draftCanvas = new Canvas(canvasInfo.width, canvasInfo.height);
        const draftCtx = draftCanvas.getContext('2d');
        const finalCanvas = new Canvas(canvasInfo.width, canvasInfo.height);
        const finalCtx = finalCanvas.getContext('2d');
        layers.push({
            id: i,
            draftCanvas,
            draftCtx,
            finalCanvas,
            finalCtx
        });
    }
    const tools: { [name: string]: Tool } = {
        circle: new CircleTool(layers),
        colorpicker: new ColorPickerTool(layers, {}, () => {}),
        eraser: new EraserTool(layers, {}, canvasInfo.backgroundColor),
        pencil: new PencilTool(layers),
        rectangle: new RectangleTool(layers)
    };
    tools.rectangle.draw([
        { x: 0, y: 0},
        { x: canvasInfo.width, y: canvasInfo.height }
    ], {
        strokeStyle: canvasInfo.backgroundColor,
        fillStyle: canvasInfo.backgroundColor,
    });
    if (canvasInfo.snapshots) {
        canvasInfo.snapshots.forEach((snapshot, i) => {
            let img = new Canvas.Image();
            img.src = snapshot;
            layers[i].finalCtx.drawImage(img, 0, 0);
        });
    }
    const history = await conn.getHistory(canvasID);
    let count = 0;
    return new Promise((resolve, reject) => {
        history.each((error, entry: DrawGaiden.HistoryEntry) => {
            if (error) {
                reportError(error);
            } else {
                count++;
                tools[entry.toolName].draw(entry.path, entry.settings);
            }
        }, async function() {
            try {
                // It would be nice if this set of operations could be made atomic, but worst case scenario
                // the user gets the snapshot *and* the squashed entries, causing the app to needlessly
                // redraw entries in the snapshot.
                canvasInfo.snapshots = layers.map(layer => {
                    return layer.finalCanvas.toDataURL('image/png');
                });
                await conn.updateCanvas(canvasInfo);
                // We want to limit the number of entries we're clearing because some may have been created while
                // the operation was running.
                await conn.clearHistory(canvasID, count);
                logger.info(`Squashed canvas "${canvasID}"`);
                resolve();
            } catch(error) {
                reject(error);
            }
        });
    });
}

async function cleanUpHistory(conn: Connection, id: string) {
    let historyCount = await conn.getHistoryCount(id);
    if (historyCount > config.janitor.historyThreshold) {
        await squash(conn, id);
    }
}

connect(config.db).then(conn => {
    async function cleanUp() {
        logger.info('Performing clean up');
        const canvasIds = await conn.getCanvasIds();
        canvasIds.each(async (error, id) => {
            if (error) {
                reportError(error);
            } else {
                try {
                    let deleted = await cleanUpCanvas(conn, id);
                    if (!deleted) {
                        await cleanUpHistory(conn, id);
                    }
                } catch(error) {
                    logger.error(error.stack);
                }
            }
        });
        setTimeout(cleanUp, config.janitor.jobInterval);
    }
    // If the server has been restarted any active users will not have been
    // cleanly disconnected and removed from the user table, so this cleans
    // up any stragglers on startup.
    conn.clearUsers();
    logger.info('Janitor running');
    cleanUp();
}).catch(error => {
    reportError(error);
    monitor.error(error.toString());
});