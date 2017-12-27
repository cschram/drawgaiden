import { Tool } from './tool';
import { ToolSettings, Coord } from '../util';

export default class RectangleTool extends Tool {
    getDefaults(): ToolSettings {
        return Object.assign({}, super.getDefaults(), {
            strokeStyle: '#000000',
            fillStyle: '#ffffff',
            lineWidth: 1,
            lineCap: 'butt',
            lineJoin: 'miter'
        });
    }

    _draw(path: Coord[], ctx: CanvasRenderingContext2D) {
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

    mouseDown(coord: Coord) {
        this.active = true;
        this.path = [coord, coord];
    }

    mouseMove(coord: Coord) {
        if (this.active) {
            const layer = this.layers[this.settings.layer as number];
            this.path[1] = coord;

            this._resetCtx(layer.draftCtx, this.settings);
            this._clear();
            this._draw(this.path, layer.draftCtx);
        }
    }

    draw(path: Coord[], settings: ToolSettings = {}) {
        settings = Object.assign({}, this.settings, settings);
        const layer = this.layers[settings.layer as number];
        this._resetCtx(layer.finalCtx, settings);
        this._draw(path, layer.finalCtx);
    }
}