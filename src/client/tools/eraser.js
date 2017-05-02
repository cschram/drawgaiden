import Tool from './tool';

class EraserTool extends Tool {
    _clone = null;
    _cloneCtx = null;

    constructor(finalCtx, draftCtx, settings) {
        super(finalCtx, draftCtx, settings);
        this._clone = document.createElement('canvas');
        this._clone.width = this.finalCtx.canvas.width;
        this._clone.height = this.finalCtx.canvas.height;
        this._cloneCtx = this._clone.getContext('2d');
    }

    _resetCtx(ctx, settings, clear) {
        settings.globalCompositeOperation = 'destination-out';
        settings.strokeStyle = 'rgba(0, 0, 0, 1)';
        super._resetCtx(ctx, settings, clear);
    }

    mouseDown(coord) {
        super.mouseDown(coord);

        // Clone main canvas
        this._clear(this._cloneCtx);
        this._cloneCtx.drawImage(this.finalCtx.canvas, 0, 0);
        this.draftCtx.drawImage(this.finalCtx.canvas, 0, 0);

        // Clear main context temporarily
        this._clear(this.finalCtx);
    }

    mouseUp() {
        if (this.active) {
            this.finalCtx.drawImage(this._clone, 0, 0);
        }
        return super.mouseUp();
    }
}

export default EraserTool;