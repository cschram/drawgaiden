import { Tool } from './tool';
import { ToolSettings, Coord } from '../util';

export default class CircleTool extends Tool {
    _draw(path: Coord[], ctx: CanvasRenderingContext2D) {
        const radius = Math.sqrt(Math.pow(path[0].x - path[1].x, 2) + Math.pow(path[0].y - path[1].y, 2));

        ctx.beginPath();
        ctx.arc(path[0].x, path[0].y, radius, 0, 2 * Math.PI);
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
            this.path[1] = coord;

            this._resetCtx(this.draftCtx, this.settings);
            this._clear();
            this._draw(this.path, this.draftCtx);
        }
    }

    draw(path: Coord[], settings: ToolSettings = null) {
        settings = settings || this.settings;

        this._resetCtx(this.finalCtx, settings);
        this._draw(path, this.finalCtx);
    }
}