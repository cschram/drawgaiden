import { Tool } from './tool';
import { ToolSettings, Coord } from '../util';
import * as simplify from 'simplify-js';

export default class PencilTool extends Tool {
    mouseMove(coord: Coord) {
        super.mouseMove(coord);

        if (this.active) {
            this.draftCtx.beginPath();

            this.draftCtx.moveTo(this.lastCoord.x, this.lastCoord.y);
            this.draftCtx.lineTo(coord.x, coord.y);

            this._resetCtx(this.draftCtx, this.settings);
            this.draftCtx.stroke();
            this.draftCtx.closePath();

            this.lastCoord = coord;
        }
    }

    draw(path: Coord[], settings: ToolSettings) {
        if (path.length === 0) {
            return;
        }

        settings = Object.assign({}, this.settings, settings);

        this.finalCtx.beginPath();
        this._resetCtx(this.finalCtx, settings);

        if (path.length === 1) {
            this.finalCtx.fillStyle = settings.strokeStyle as string;
            this.finalCtx.arc(
                path[0].x,
                path[0].y,
                settings.lineWidth as number / 2,
                0,
                2 * Math.PI,
                false
            );
            this.finalCtx.fill();
        } else {
            path = simplify(path, settings.smoothness as number / 100);
            if (path.length === 2) {
                this.finalCtx.moveTo(path[0].x, path[0].y);
                this.finalCtx.lineTo(path[1].x, path[1].y);
            } else {
                this.finalCtx.moveTo(path[0].x, path[0].y);
                let i = 1;
                for (; i < path.length - 2; i++) {
                    let mx = (path[i].x + path[i + 1].x) / 2;
                    let my = (path[i].y + path[i + 1].y) / 2;
                    this.finalCtx.quadraticCurveTo(path[i].x, path[i].y, mx, my);
                }
                this.finalCtx.quadraticCurveTo(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
            }
            this.finalCtx.stroke();
        }

        this.finalCtx.closePath();
    }
}