import { Tool } from './tool';
import { ToolSettings, Coord } from '../util';
import { rgbToHex } from '../util';

type ColorPickCallback = (type: string, color: string) => void;

export default class ColorPickerTool extends Tool {
    private onPick: ColorPickCallback;

    constructor(
        finalCtx: CanvasRenderingContext2D,
        draftCtx: CanvasRenderingContext2D,
        settings: ToolSettings = null,
        onPick: ColorPickCallback
    ) {
        super(finalCtx, draftCtx, settings);
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
        this.onPick(this.settings.primary ? 'stroke' : 'fill', color);
    }

    mouseDown(coord: Coord) {
        this.active = true;
        this._pick(this.finalCtx, coord);
    }

    mouseUp(): Coord[] {
        this.active = false;
        return [];
    }

    mouseMove(coord: Coord) {
        if (this.active) {
            this._pick(this.finalCtx, coord);
        }
    }
}