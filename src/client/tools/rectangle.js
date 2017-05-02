import Tool from './tool';

class RectangleTool extends Tool {
    getDefaults() {
        return Object.assign({}, super.getDefaults(), {
            strokeStyle: '#000000',
            fillStyle: '#ffffff',
            lineWidth: 1,
            lineCap: 'butt',
            lineJoin: 'miter'
        });
    }

    _draw(path, ctx) {
        const start = {
            x: (path[0].x > path[1].x) ? path[1].x : path[0].x,
            y: (path[0].x > path[1].y) ? path[1].y : path[0].y
        };
        const end = {
            x: (path[0].x < path[1].x) ? path[1].x : path[0].x,
            y: (path[0].x < path[1].y) ? path[1].y : path[0].y
        };

        ctx.beginPath();
        ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
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

export default RectangleTool;