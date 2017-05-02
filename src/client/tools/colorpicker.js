import Tool from './tool';
import { rgbToHex } from '../util/conv';

class ColorPickerTool extends Tool {
    constructor(finalCtx, draftCtx, settings, onPick) {
        super(finalCtx, draftCtx, settings);
        this.onPick = onPick;
    }

    getDefaults() {
        return Object.assign({}, super.getDefaults(), {
            sendUpdates: false
        });
    }

    _pick(ctx, coord) {
        const data = ctx.getImageData(coord.x, coord.y, 1, 1).data;
        const color = rgbToHex.apply(window, data);
        this.onPick(this.settings.primary ? 'stroke' : 'fill', color);
    }

    mouseDown(coord) {
        this.active = true;
        this._pick(this.finalCtx, coord);
    }

    mouseUp() {
        this.active = false;
    }

    mouseMove(coord) {
        if (this.active) {
            this._pick(this.finalCtx, coord);
        }
    }
}

export default ColorPickerTool;