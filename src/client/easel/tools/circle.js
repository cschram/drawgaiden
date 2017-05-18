import Tool from './tool';

class CircleTool extends Tool {
    _draw(path, ctx) {
        const radius = Math.sqrt(Math.pow(path[0].x - path[1].x, 2) + Math.pow(path[0].y - path[1].y, 2));

        ctx.beginPath();
        ctx.arc(path[0].x, path[0].y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    mouseDown(coord) {
        this.active = true;
        this.path = [coord, coord];
    }

    mouseMove(coord) {
        if (this.active) {
            this.path[1] = coord;

            this._resetCtx(this.draftCtx, this.settings, true);
            this._draw(this.path, this.draftCtx);
        }
    }

    draw(path, settings) {
        settings = settings || this.settings;

        this._resetCtx(this.finalCtx, settings);
        this._draw(path, this.finalCtx);
    }
}

export default CircleTool;