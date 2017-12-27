import { Layer, ToolSettings, Coord } from '../util';

export class Tool {
    // Active flag, determining whether the tool is currently in use
    active: boolean;
    // Last coordinate given to the tool during use
    lastCoord: Coord;
    // Path drawn by the mouse
    path: Coord[];
    // Canvas Layers
    layers: Layer[];
    // Tool settings
    settings: ToolSettings;

    constructor(layers: Layer[], settings: ToolSettings = {}) {
        this.layers = layers;
        this.settings = Object.assign({}, this.getDefaults(), settings);
    }

    getDefaults(): ToolSettings {
        return {
            layer: 0,
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
    _clear(ctx?: CanvasRenderingContext2D) {
        if (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        } else {
            const layer = this.layers[this.settings.layer as number];
            layer.draftCtx.clearRect(0, 0, layer.draftCtx.canvas.width, layer.draftCtx.canvas.height);
        }
    }


    //
    // Draw an arbitrary path
    //
    draw(path: Coord[], settings: ToolSettings = {}) {
        // No implementation
    }
}