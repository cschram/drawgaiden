import { ToolSettings, Layer, Coord } from '../util';
import PencilTool from './pencil';

export default class EraserTool extends PencilTool {
    private backgroundColor: string;
    private clone: HTMLCanvasElement;
    private cloneCtx: CanvasRenderingContext2D;

    constructor(layers: Layer[], settings: ToolSettings, backgroundColor: string) {
        super(layers, settings);
        this.backgroundColor = backgroundColor;
        if (typeof document !== 'undefined') {
            this.clone = document.createElement('canvas');
            this.clone.width = layers[0].finalCanvas.width;
            this.clone.height = layers[0].finalCanvas.height;
            this.cloneCtx = this.clone.getContext('2d') as CanvasRenderingContext2D;
        }
    }

    _resetCtx(ctx: CanvasRenderingContext2D, settings: ToolSettings) {
        if (settings.layer && settings.layer > 0) {
            settings.globalCompositeOperation = 'destination-out';
            settings.strokeStyle = 'rgba(0, 0, 0, 1)';
        } else {
            settings.globalCompositeOperation = 'source-over';
            settings.strokeStyle = this.backgroundColor;
        }
        settings.opacity = 100;
        super._resetCtx(ctx, settings);
    }

    mouseDown(coord: Coord) {
        super.mouseDown(coord);
        if (typeof document !== 'undefined' && this.active && this.settings.layer && this.settings.layer > 0) {
            const layer = this.layers[this.settings.layer as number];
            this._clear(this.cloneCtx);
            this.cloneCtx.drawImage(layer.finalCanvas, 0, 0);
            layer.draftCtx.drawImage(this.clone, 0, 0);
            this._clear(layer.finalCtx);
        }
    }

    mouseUp(): Coord[] {
        if (typeof document !== 'undefined' && this.active && this.settings.layer && this.settings.layer > 0) {
            const layer = this.layers[this.settings.layer as number];
            layer.finalCtx.drawImage(this.clone, 0, 0);
        }
        return super.mouseUp();
    }
}