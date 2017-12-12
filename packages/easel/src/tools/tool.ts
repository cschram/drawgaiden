import { ToolSettings, Coord } from '../util';

export class Tool {
    // Active flag, determining whether the tool is currently in use
    active: boolean;
    // Last coordinate given to the tool during use
    lastCoord: Coord;
    // Path drawn by the mouse
    path: Coord[];
    // "Final" context, where the changes are finalized
    finalCtx: CanvasRenderingContext2D;
    // "Draft" context, used for displaying temporary tool paths
    // i.e. guide lines for a rectangle tool
    draftCtx: CanvasRenderingContext2D;
    // Tool settings
    settings: ToolSettings;

    constructor(finalCtx: CanvasRenderingContext2D, draftCtx: CanvasRenderingContext2D, settings: ToolSettings = {}) {
        if (!finalCtx) {
            throw new Error( 'Missing final contexts in tool constructor.' );
        }

        this.finalCtx = finalCtx;
        this.draftCtx = draftCtx;
        this.settings = Object.assign({}, this.getDefaults(), settings);
    }

    getDefaults(): ToolSettings {
        return {
            strokeStyle: '#000000',
            fillStyle: '#ffffff',
            lineWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            opacity: 100,
            globalCompositeOperation: 'source-over',
            smoothness: 80,
            primary: true,
            sendUpdates: true
        };
    }

    //
    // Mouse down method, passed from parent component
    //
    mouseDown(coord: Coord) {
        this.active = true;
        this.lastCoord = coord;
        this.path = [coord];
    }

    //
    // Mouse up method, passed from parent component
    //
    mouseUp(): Coord[] {
        if (this.active) {
            this.active = false;
            this._clear();
            this.draw(this.path);
            return this.path;
        }
        return [];
    }

    //
    // Mouse move method, passed from parent component
    //
    mouseMove(coord: Coord) {
        if (this.active) {
            this.path.push(coord);
        }
    }


    //
    // Reset context styling
    //
    _resetCtx(ctx: CanvasRenderingContext2D, settings: ToolSettings) {
        // Reset context styling
        if (settings.primary) {
            ctx.strokeStyle = settings.strokeStyle as string;
            ctx.fillStyle = settings.fillStyle as string;
        } else {
            // Swap colors when using secondary mouse mode (right button)
            ctx.strokeStyle = settings.fillStyle as string;
            ctx.fillStyle = settings.strokeStyle as string;
        }
        ctx.lineWidth = settings.lineWidth as number;
        ctx.lineCap = settings.lineCap as string;
        ctx.lineJoin = settings.lineJoin as string;
        ctx.globalAlpha = settings.opacity as number / 100;
        ctx.globalCompositeOperation = settings.globalCompositeOperation as string;
    }


    //
    // Clear canvas
    //
    _clear() {
        this.draftCtx.clearRect(0, 0, this.draftCtx.canvas.width, this.draftCtx.canvas.height);
    }


    //
    // Draw an arbitrary path
    //
    draw(path: Coord[], settings: ToolSettings = {}) {
        // No implementation
    }
}