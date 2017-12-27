import { Tool } from './tool';
import { Layer, ToolSettings, Coord } from '../util';
import { rgbToHex } from '../util';

export type ColorPickCallback = (type: string, color: string, opacity: number) => void;

export default class ColorPickerTool extends Tool {
    private onPick: ColorPickCallback;

    constructor(layers: Layer[], settings: ToolSettings = {}, onPick: ColorPickCallback) {
        super(layers, settings);
        this.onPick = onPick;
    }

    getDefaults(): ToolSettings {
        return Object.assign({}, super.getDefaults(), {
            sendUpdates: false
        });
    }

    _pick(ctx: CanvasRenderingContext2D, coord: Coord) {
        const data = ctx.getImageData(coord.x, coord.y, 1, 1).data;
        const color = rgbToHex.apply(window, data);
        const opacity = (data[3] / 255) * 100;
        this.onPick(this.settings.primary ? 'stroke' : 'fill', color, opacity);
    }

    mouseDown(coord: Coord) {
        const layer = this.layers[this.settings.layer as number];
        this.active = true;
        this._pick(layer.finalCtx, coord);
    }

    mouseUp(): Coord[] {
        this.active = false;
        return [];
    }

    mouseMove(coord: Coord) {
        if (this.active) {
            const layer = this.layers[this.settings.layer as number];
            this._pick(layer.finalCtx, coord);
        }
    }
}