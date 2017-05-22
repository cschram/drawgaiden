import Tool from './tool';
import simplify from 'simplify';

class PencilTool extends Tool {
    mouseMove(coord) {
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

    draw(path, settings) {
        if (path.length === 0) {
            return;
        }

        settings = settings || this.settings;

        this.finalCtx.beginPath();
        this._resetCtx(this.finalCtx, settings);

        if (path.length === 1) {
            this.finalCtx.fillStyle = settings.strokeStyle;
            this.finalCtx.arc(
                path[0].x,
                path[0].y,
                settings.lineWidth / 2,
                0,
                2 * Math.PI,
                false
            );
            this.finalCtx.fill();
        } else {
            path = simplify(path, 0.8, true);

            for (let i = 1, len = path.length; i < len; i++) {
                this.finalCtx.moveTo(path[i - 1].x,
                                     path[i - 1].y);
                this.finalCtx.lineTo(path[i].x,
                                     path[i].y);
            }

            this.finalCtx.stroke();
        }

        this.finalCtx.closePath();
    }
}

export default PencilTool;