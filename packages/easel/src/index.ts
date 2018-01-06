import { Tool } from './tools/tool';
import { Layer, ToolSettings, Coord } from './util';
import CircleTool from './tools/circle';
import ColorPickerTool from './tools/colorpicker';
import EraserTool from './tools/eraser';
import PencilTool from './tools/pencil';
import RectangleTool from './tools/rectangle';

const MOUSE_BUTTON_PRIMARY = 1;
const MOUSE_BUTTON_SCROLL = 2;
const MOUSE_BUTTON_SECONDARY = 3;

export interface EaselOptions {
    width?: number;
    height?: number;
    backgroundColor?: string;
    layers?: number;
    onMouseMove?: (coord: Coord) => void;
    onDraw?: (path: Coord[]) => void;
}

const defaultOptions: EaselOptions = {
    width: 2560,
    height: 1440,
    backgroundColor: '#ffffff',
    layers: 3,
    onMouseMove: () => {},
    onDraw: () => {}
};

type ToolFunction = (event: string, coord?: Coord) => Coord[] | void;
type Tools = {
    [name: string]: Tool | ToolFunction
};

export default class Easel {
    private options: EaselOptions;
    private container: HTMLElement;
    private wrapper: HTMLElement;
    private offsetTargets: HTMLElement[];
    private layers: Layer[];
    private tools: Tools;
    private tool: string;
    private activeLayer: number;
    private drawing: boolean;
    private moving: boolean;
    private mouseCoord: Coord;
    private offsetCoord: Coord;
    private lastOffsetCoord: Coord;
    private anchorCoord: Coord;

    constructor(container: HTMLElement, options: EaselOptions = {}) {
        this.options = Object.assign({}, defaultOptions, options);

        // Setup DOM
        if (document != null) {
            this.container = container;
            if (this.container.style.position === 'static') {
                this.container.style.position = 'relative';
            }
            this.wrapper = document.createElement('div');
            this.container.insertBefore(this.wrapper, this.container.children[0]);
            this.layers = [];
            for (let i = 0; i < (this.options.layers as number); i++) {
                // Create final canvas
                let $canvasFinal = document.createElement('canvas') as HTMLCanvasElement;
                $canvasFinal.style.position = 'absolute';
                $canvasFinal.width = this.options.width as number;
                $canvasFinal.height = this.options.height as number;
                this.wrapper.appendChild($canvasFinal);
                // Create draft canvas
                let $canvasDraft = document.createElement('canvas') as HTMLCanvasElement;
                $canvasDraft.style.position = 'absolute';
                $canvasDraft.width = this.options.width as number;
                $canvasDraft.height = this.options.height as number;
                this.wrapper.appendChild($canvasDraft);
                // Push layer descriptor
                this.layers.push({
                    id: i,
                    finalCanvas: $canvasFinal,
                    finalCtx: $canvasFinal.getContext('2d') as CanvasRenderingContext2D,
                    draftCanvas: $canvasDraft,
                    draftCtx: $canvasDraft.getContext('2d') as CanvasRenderingContext2D
                });
            }
            this.offsetTargets = Array.from(this.container.children) as HTMLElement[];
            this.offsetTargets.forEach(el => {
                el.style.position = 'absolute';
                el.style.width = `${this.options.width as number}px`;
                el.style.height = `${this.options.height as number}px`;
            });

            // Bind events
            this.container.addEventListener('mousedown', this.onMouseDown, true);
            this.container.addEventListener('mouseup', this.onMouseUp, true);
            this.container.addEventListener('mousemove', this.onMouseMove, true);
            this.container.addEventListener('touchstart', this.onTouchEvent, true);
            this.container.addEventListener('touchend', this.onTouchEvent, true);
            this.container.addEventListener('touchmove', this.onTouchEvent, true);
        }

        // Setup tools
        const moveTool = (eventName: string, coord?: Coord) => {
            if (eventName === 'mouseDown' && coord) {
                this.moving = true;
                this.lastOffsetCoord = this.offsetCoord;
                this.anchorCoord = coord;
            }
            if (this.moving) {
                if (eventName === 'mouseUp') {
                    this.moving = false;
                } else if (eventName === 'mouseMove' && coord) {
                    let diff = {
                        x: this.anchorCoord.x - coord.x,
                        y: this.anchorCoord.y - coord.y
                    };
                    this.lastOffsetCoord = this.offsetCoord;
                    this.setOffset({
                        x: this.lastOffsetCoord.x - diff.x,
                        y: this.lastOffsetCoord.y - diff.y
                    });
                }
            }
        };
        const onPick = (type, color, opacity) => {
            if (type === 'stroke') {
                this.setStrokeColor(color);
            } else {
                this.setFillColor(color);
            }
            this.setToolOpacity(opacity);
        };
        this.tools = {
            circle: new CircleTool(this.layers),
            colorpicker: new ColorPickerTool(this.layers, {}, onPick),
            eraser: new EraserTool(this.layers, {}, this.options.backgroundColor as string),
            pencil: new PencilTool(this.layers),
            rectangle: new RectangleTool(this.layers),
            move: moveTool
        };

        // Initialize misc state
        this.drawing = false;
        this.moving = false;
        this.mouseCoord = { x: 0, y: 0 };
        this.activeLayer = 0;
        this.tool = 'pencil';
        this.setOffset({
            x: (this.container.clientWidth / 2) - (this.options.width as number / 2),
            y: (this.container.clientHeight / 2) - (this.options.height as number / 2)
        });
        this.clear();
    }

    getTool(): string {
        return this.tool;
    }

    setTool(tool: string) {
        if (Object.keys(this.tools).indexOf(tool) > -1) {
            this.tool = tool;
        }
    }

    setStrokeColor(color: string) {
        this.setToolSetting('strokeStyle', color);
    }

    setFillColor(color: string) {
        this.setToolSetting('fillStyle', color);
    }

    setToolSize(size: number) {
        this.setToolSetting('lineWidth', size);
    }

    setToolOpacity(opacity: number) {
        this.setToolSetting('opacity', opacity);
    }

    setToolSmoothness(smoothness: number) {
        this.setToolSetting('smoothness', smoothness);
    }

    getToolSettings(): ToolSettings {
        if (this.tools[this.tool] instanceof Tool) {
            return (this.tools[this.tool] as Tool).settings;
        }
        return {};
    }

    setToolSettings(settings: ToolSettings) {
        Object.keys(this.tools).forEach(toolName => {
            if (this.tools[toolName] instanceof Tool) {
                this.tool[toolName].settings = settings;
            }
        });
    }

    setToolSetting(name: string, value: any) {
        Object.keys(this.tools).forEach(toolName => {
            if (this.tools[toolName] instanceof Tool) {
                (this.tools[toolName] as Tool).settings[name] = value;
            }
        });
    }

    setLayer(layer: number) {
        this.activeLayer = layer;
        this.setToolSetting('layer', layer);
    }

    clear(layer?: number) {
        if (typeof layer === 'number') {
            (this.tools.rectangle as Tool).draw([
                { x: 0, y: 0},
                { x: this.options.width as number, y: this.options.height as number }
            ], {
                strokeStyle: this.options.backgroundColor,
                fillStyle: this.options.backgroundColor,
            });
            this.layers[layer].draftCtx.clearRect(0, 0, this.options.width as number, this.options.height as number);
        } else {
            for (let i = 0; i < (this.options.layers as number); i++) {
                this.clear(i);
            }
        }
    }

    draw(tool: string, path: Coord[], settings: ToolSettings = {}) {
        if (this.tools[tool] instanceof Tool) {
            (this.tools[tool] as Tool).draw(path, settings);
        }
    }

    drawImage(img: HTMLImageElement, coord: Coord, layer?: number) {
        if (typeof layer === 'number') {
            this.layers[layer].finalCtx.drawImage(img, coord.x, coord.y);
        } else {
            this.layers[this.activeLayer].finalCtx.drawImage(img, coord.x, coord.y);
        }
    }

    toDataURL(): string {
        const $canvas = document.createElement('canvas');
        $canvas.width = this.options.width as number;
        $canvas.height = this.options.height as number;
        const $ctx = $canvas.getContext('2d') as CanvasRenderingContext2D;
        this.layers.forEach(layer => {
            $ctx.drawImage(layer.finalCanvas, 0, 0);
        });
        return $canvas.toDataURL('image/png');
    }

    private callEvent(eventName: string, coord?: Coord): Coord[] | void {
        if (this.tools[this.tool] instanceof Tool) {
            let tool = this.tools[this.tool] as Tool;
            if (coord) {
                return tool[eventName](coord);
            } else {
                return tool[eventName]();
            }
        } else {
            let tool = this.tools[this.tool] as ToolFunction;
            if (coord) {
                return tool(eventName, coord);
            } else {
                return tool(eventName);
            }
        }
    }

    private setOffset(coord: Coord) {
        if ((this.options.width as number) > this.container.clientWidth) {
            if (coord.x > 0) {
                coord.x = 0;
            } else if (coord.x < (this.container.clientWidth - (this.options.width as number))) {
                coord.x = this.container.clientWidth - (this.options.width as number);
            }
        }
        if ((this.options.height as number) > this.container.clientHeight) {
            if (coord.y > 0) {
                coord.y = 0;
            } else if (coord.y < (this.container.clientHeight - (this.options.height as number))) {
                coord.y = this.container.clientHeight - (this.options.height as number);
            }
        }
        this.offsetCoord = coord;
        this.offsetTargets.forEach(el => {
            el.style.left = `${coord.x}px`;
            el.style.top = `${coord.y}px`;
        });
    }

    private getMouseCoord(e): Coord {
        this.mouseCoord = { x: e.pageX, y: e.pageY };
        return {
            x: e.pageX - (this.container.offsetLeft + this.offsetCoord.x),
            y: e.pageY - (this.container.offsetTop + this.offsetCoord.y)
        };
    }

    /**
     * Events
     */

    private onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        this.drawing = true;
        if (e.which === MOUSE_BUTTON_PRIMARY) {
            this.setToolSetting('primary', true);
        } else {
            this.setToolSetting('primary', false);
        }
        let coord = this.getMouseCoord(e);
        this.callEvent('mouseDown', coord);
    };

    private onMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        if (this.drawing) {
            this.drawing = false;
            let path = this.callEvent('mouseUp');
            if (path && this.options.onDraw) {
                this.options.onDraw(path);
            }
        }
    };

    private onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        let coord = this.getMouseCoord(e);
        if (this.drawing) {
            this.callEvent('mouseMove', coord);
        }
        if (this.options.onMouseMove) {
            this.options.onMouseMove(coord);
        }
    };

    private onTouchEvent = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        let mouseEventName = '';
        if (e.type === 'touchstart') {
            mouseEventName = 'mousedown';
        } else if (e.type === 'touchend') {
            mouseEventName = 'mouseup';
        } else if (e.type === 'touchmove') {
            mouseEventName = 'mousemove';
        }
        let mouseEvent = document.createEvent('MouseEvent');
        mouseEvent.initMouseEvent(mouseEventName, true, true, window, 1, touch.screenX, touch.screenY,
                                  touch.clientX, touch.clientY, false, false, false, false, 0, null);
        this.container.dispatchEvent(mouseEvent);
    };
}