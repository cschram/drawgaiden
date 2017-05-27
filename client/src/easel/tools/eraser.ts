import PencilTool from './pencil';

class EraserTool extends PencilTool {
    constructor(finalCtx, draftCtx, settings, backgroundColor) {
        super(finalCtx, draftCtx, settings);
        this._backgroundColor = backgroundColor;
    }

    _resetCtx(ctx, settings, clear) {
        settings.strokeStyle = this._backgroundColor;
        super._resetCtx(ctx, settings, clear);
    }
}

export default EraserTool;