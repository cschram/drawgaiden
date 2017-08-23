import * as Canvas from 'canvas';
import config from '../lib/config';
import { Connection, connect } from '../lib/db';
import Logger from '../lib/logger';
import { HealthMonitor } from '../lib/healthmonit';
import { Canvas as CanvasInfo,HistoryEntry } from '../../../common/canvas';
// This needs to be managed better...
import { Tool } from '@drawgaiden/easel/lib/tools/tool';
import CircleTool from '@drawgaiden/easel/lib/tools/circle';
import ColorPickerTool from '@drawgaiden/easel/lib/tools/colorpicker';
import EraserTool from '@drawgaiden/easel/lib/tools/eraser';
import PencilTool from '@drawgaiden/easel/lib/tools/pencil';
import RectangleTool from '@drawgaiden/easel/lib/tools/rectangle';

const logger = Logger('janitor');
const monitor = new HealthMonitor({
    port: config.janitor.monitorPort
});

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
    const canvasInfo: CanvasInfo = await conn.getCanvas(canvasID) as any; // Can't coerce Cursor into CanvasInfo...
    const canvas: HTMLCanvasElement = new Canvas(canvasInfo.width, canvasInfo.height);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    const tools: { [name: string]: Tool } = {
        circle: new CircleTool(ctx, ctx),
        colorpicker: new ColorPickerTool(ctx, ctx, {}, () => {}),
        eraser: new EraserTool(ctx, ctx, {}, canvasInfo.backgroundColor),
        pencil: new PencilTool(ctx, ctx),
        rectangle: new RectangleTool(ctx, ctx)
    };
    tools.rectangle.draw([
        { x: 0, y: 0},
        { x: canvasInfo.width, y: canvasInfo.height }
    ], {
        strokeStyle: canvasInfo.backgroundColor,
        fillStyle: canvasInfo.backgroundColor,
    });
    if (canvasInfo.snapshot) {
        let img = new Canvas.Image();
        img.src = canvasInfo.snapshot;
        ctx.drawImage(img, 0, 0);
    }
    const history = await conn.getHistory(canvasID);
    let count = 0;
    return new Promise((resolve, reject) => {
        history.each((error, entry: HistoryEntry) => {
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
                canvasInfo.snapshot = canvas.toDataURL('image/png');
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
                let deleted = await cleanUpCanvas(conn, id);
                if (!deleted) {
                    await cleanUpHistory(conn, id);
                }
            }
        });
        setTimeout(cleanUp, config.janitor.jobInterval);
    }
    // If the server has been restarted any active users will not have been
    // cleanly disconnected and removed from the user table, so this cleans
    // up any stragglers on startup.
    conn.clearUsers();
    setTimeout(cleanUp, config.janitor.jobInterval);
    logger.info('Janitor running');
}).catch(error => {
    reportError(error);
    monitor.error(error.toString());
});