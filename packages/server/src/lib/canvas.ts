import * as NodeCanvas from 'canvas';
import { Canvas, HistoryEntry } from '@drawgaiden/common';
import { Tool } from '@drawgaiden/easel/lib/tools/tool';
import CircleTool from '@drawgaiden/easel/lib/tools/circle';
import ColorPickerTool from '@drawgaiden/easel/lib/tools/colorpicker';
import EraserTool from '@drawgaiden/easel/lib/tools/eraser';
import PencilTool from '@drawgaiden/easel/lib/tools/pencil';
import RectangleTool from '@drawgaiden/easel/lib/tools/rectangle';
import { Layer } from '@drawgaiden/easel/lib/util';

export function flatten(canvas: Canvas, history: HistoryEntry[]): string {
    const destination = new NodeCanvas(canvas.width, canvas.height);
    const destinationCtx = destination.getContext('2d');
    const layers: Layer[] = [];
    for (let i = 0; i < canvas.layers; i++) {
        const draftCanvas = new NodeCanvas(canvas.width, canvas.height);
        const draftCtx = draftCanvas.getContext('2d');
        const finalCanvas = new NodeCanvas(canvas.width, canvas.height);
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
        eraser: new EraserTool(layers, {}, canvas.backgroundColor),
        pencil: new PencilTool(layers),
        rectangle: new RectangleTool(layers)
    };
    tools.rectangle.draw([
        { x: 0, y: 0},
        { x: canvas.width, y: canvas.height }
    ], {
        strokeStyle: canvas.backgroundColor,
        fillStyle: canvas.backgroundColor,
    });
    if (canvas.snapshots) {
        canvas.snapshots.forEach((snapshot, i) => {
            let img = new NodeCanvas.Image();
            img.src = snapshot;
            layers[i].finalCtx.drawImage(img, 0, 0);
        });
    }
    history.forEach(entry => {
        tools[entry.toolName].draw(entry.path, entry.settings);
    });
    layers.forEach(layer => {
        let img = new NodeCanvas.Image();
        img.src = layer.finalCanvas.toDataURL('image/png');
        destinationCtx.draftCanvas(img, 0, 0);
    });
    return destination.toDataURL('image/png');
}