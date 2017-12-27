import { Tool } from './tool';
import { ToolSettings, Coord } from '../util';
import * as simplify from 'simplify-js';

export default class PencilTool extends Tool {
    mouseMove(coord: Coord) {
        super.mouseMove(coord);
        if (this.active) {
            const layer = this.layers[this.settings.layer as number];
            layer.draftCtx.beginPath();

            layer.draftCtx.moveTo(this.lastCoord.x, this.lastCoord.y);
            layer.draftCtx.lineTo(coord.x, coord.y);

            this._resetCtx(layer.draftCtx, this.settings);
            layer.draftCtx.stroke();
            layer.draftCtx.closePath();

            this.lastCoord = coord;
        }
    }

    draw(path: Coord[], settings: ToolSettings) {
        if (path.length === 0) {
            return;
        }

        settings = Object.assign({}, this.settings, settings);
        const layer = this.layers[settings.layer as number];

        layer.finalCtx.beginPath();
        this._resetCtx(layer.finalCtx, settings);

        if (path.length === 1) {
            layer.finalCtx.fillStyle = settings.strokeStyle as string;
            layer.finalCtx.arc(
                path[0].x,
                path[0].y,
                settings.lineWidth as number / 2,
                0,
                2 * Math.PI,
                false
            );
            layer.finalCtx.fill();
        } else {
            path = simplify(path, settings.smoothness as number / 100);
            if (path.length === 2) {
                layer.finalCtx.moveTo(path[0].x, path[0].y);
                layer.finalCtx.lineTo(path[1].x, path[1].y);
            } else {
                layer.finalCtx.moveTo(path[0].x, path[0].y);
                let i = 1;
                for (; i < path.length - 2; i++) {
                    let mx = (path[i].x + path[i + 1].x) / 2;
                    let my = (path[i].y + path[i + 1].y) / 2;
                    layer.finalCtx.quadraticCurveTo(path[i].x, path[i].y, mx, my);
                }
                layer.finalCtx.quadraticCurveTo(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
            }
            layer.finalCtx.stroke();
        }

        layer.finalCtx.closePath();
    }
}