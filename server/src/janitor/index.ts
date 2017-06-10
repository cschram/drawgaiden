import * as Canvas from 'canvas';
import config from '../lib/config';
import { Connection, connect } from '../lib/db';
import Logger from '../lib/logger';
import { Canvas as CanvasInfo,HistoryEntry } from '../../../defs/canvas';
// This needs to be managed better...
import { Tool } from '../../../client/src/easel/tools/tool';
import CircleTool from '../../../client/src/easel/tools/circle';
import ColorPickerTool from '../../../client/src/easel/tools/colorpicker';
import EraserTool from '../../../client/src/easel/tools/eraser';
import PencilTool from '../../../client/src/easel/tools/pencil';
import RectangleTool from '../../../client/src/easel/tools/rectangle';

const logger = Logger('janitor');

function reportError(error: any) {
    if (error.stack) {
        logger.error(error.stack);
    } else {
        logger.error(error);
    }
}

// Squash a canvases history into a snapshot.
async function squash(conn: Connection, canvasID: string) {
    try {
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
        history.each((error, entry: HistoryEntry) => {
            if (error) {
                reportError(error);
            } else {
                count++;
                tools[entry.toolName].draw(entry.path, entry.settings);
            }
        }, async function() {
            try {
                // We want to limit the number of entries we're clearing because some may have been created while
                // the operation was running.
                await conn.clearHistory(canvasID, count);
                canvasInfo.snapshot = canvas.toDataURL('image/png');
                // There's a very slight chance that a user might encounter the teporary state where history
                // has been cleared but the canvas hasn't been updated with the new snapshot.
                await conn.updateCanvas(canvasInfo);
                logger.info(`Squashed canvas "${canvasID}"`);
            } catch(error) {
                reportError(error);
            }
        });
    } catch(error) {
        reportError(error);
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
                let count = await conn.getHistoryCount(id);
                if (count > config.janitor.historyThreshold) {
                    await squash(conn, id);
                }
            }
        });
        setTimeout(cleanUp, config.janitor.jobInterval);
    }
    setTimeout(cleanUp, config.janitor.jobInterval);
    logger.info('Janitor running');
}).catch(error => {
    reportError(error);
    process.exit();
});