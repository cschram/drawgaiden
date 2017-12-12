import { Tool } from './tools/tool';
import { ToolSettings, Coord } from './util';
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
    onMouseMove?: (coord: Coord) => void;
    onDraw?: (path: Coord[]) => void;
}

const defaultOptions: EaselOptions = {
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    onMouseMove: () => {},
    onDraw: () => {}
};

type ToolFunction = (event: string, coord?: Coord) => Coord[] | void;
type Tools = {
    [name: string]: Tool | ToolFunction
};

export default class Easel {
    private container: HTMLElement;
    private options: EaselOptions;
    private canvasWrap: HTMLElement;
    private offsetTargets: HTMLElement[];
    private saveButton: HTMLElement;

    private finalCtx: CanvasRenderingContext2D;
    private draftCtx: CanvasRenderingContext2D;

    private toolOptions: HTMLInputElement[];
    private strokeColor: HTMLInputElement;
    private fillColor: HTMLInputElement;
    private colorSwitch: HTMLAnchorElement;
    private toolSize: HTMLInputElement;
    private toolOpacity: HTMLInputElement;
    private toolSmoothness: HTMLInputElement;

    private tools: Tools;
    private tool: string;

    private drawing: boolean;
    private moving: boolean;
    private mouseCoord: Coord;
    private offsetCoord: Coord;
    private lastOffsetCoord: Coord;
    private anchorCoord: Coord;

    constructor(container: HTMLElement, options: EaselOptions = {}) {
        this.container = container;
        this.options = Object.assign({}, defaultOptions, options);

        // Grab canvas elements and setup context
        this.canvasWrap = this.container.getElementsByClassName('easel__canvas')[0] as HTMLElement;
        const finalCanvas = this.container.getElementsByClassName('easel__canvas-final')[0] as HTMLCanvasElement;
        const draftCanvas = this.container.getElementsByClassName('easel__canvas-draft')[0] as HTMLCanvasElement;
        const canvases = [finalCanvas, draftCanvas];
        const overlays = Array.from(this.container.getElementsByClassName('easel__overlay') as NodeListOf<HTMLElement>);
        this.offsetTargets = overlays.concat(canvases);
        this.saveButton = this.container.getElementsByClassName('easel__save')[0] as HTMLElement;
        canvases.forEach(canvas => {
            canvas.width = this.options.width as number;
            canvas.height = this.options.height as number;
        });
        overlays.forEach(overlay => {
            overlay.style.width = `${this.options.width}px`;
            overlay.style.height = `${this.options.height}px`;
        });
        this.finalCtx = finalCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.draftCtx = draftCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.setOffset({
            x: (this.canvasWrap.clientWidth / 2) - (this.options.width as number / 2),
            y: (this.canvasWrap.clientHeight / 2) - (this.options.height as number / 2)
        });

        // Setup tools
        this.toolOptions = Array.from(this.container.querySelectorAll('[name=tool]')) as HTMLInputElement[];
        this.strokeColor = this.container.querySelectorAll('[name=stroke-color]')[0] as HTMLInputElement;
        this.fillColor = this.container.querySelectorAll('[name=fill-color]')[0] as HTMLInputElement;
        this.colorSwitch = this.container.querySelectorAll('.easel__color-switch')[0] as HTMLAnchorElement;
        this.toolSize = this.container.querySelectorAll('[name=size]')[0] as HTMLInputElement;
        this.toolOpacity = this.container.querySelectorAll('[name=opacity]')[0] as HTMLInputElement;
        this.toolSmoothness = this.container.querySelectorAll('[name=smoothness]')[0] as HTMLInputElement;

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

        const onPick = (type, color) => {
            if (type === 'stroke') {
                this.setStrokeColor(color);
            } else {
                this.setFillColor(color);
            }
        };
        this.tools = {
            circle: new CircleTool(this.finalCtx, this.draftCtx),
            colorpicker: new ColorPickerTool(this.finalCtx, this.draftCtx, {}, onPick),
            eraser: new EraserTool(this.finalCtx, this.draftCtx, {}, this.options.backgroundColor as string),
            pencil: new PencilTool(this.finalCtx, this.draftCtx),
            rectangle: new RectangleTool(this.finalCtx, this.draftCtx),
            move: moveTool
        };
        let checkedTool = this.container.querySelectorAll('.easel__tool input:checked')[0] as HTMLInputElement;
        this.tool = checkedTool.value;

        // Initialize misc state
        this.drawing = false;
        this.moving = false;
        this.mouseCoord = { x: 0, y: 0 };

        // Bind events
        this.canvasWrap.addEventListener('mousedown', this.onMouseDown, true);
        this.canvasWrap.addEventListener('mouseup', this.onMouseUp, true);
        this.canvasWrap.addEventListener('mousemove', this.onMouseMove, true);
        this.canvasWrap.addEventListener('touchstart', this.onTouchEvent, true);
        this.canvasWrap.addEventListener('touchend', this.onTouchEvent, true);
        this.canvasWrap.addEventListener('touchmove', this.onTouchEvent, true);
        this.saveButton.addEventListener('click', this.onSave, true);
        this.toolOptions.forEach(option => {
            option.addEventListener('change', this.onToolChange, true);
        });
        this.strokeColor.addEventListener('change', this.onStrokeColorChange, true);
        this.fillColor.addEventListener('change', this.onFillColorChange, true);
        this.colorSwitch.addEventListener('click', this.onColorSwitchClick, true);
        this.toolSize.addEventListener('change', this.onToolSizeChange, true);
        this.toolOpacity.addEventListener('change', this.onToolOpacityChange, true);
        this.toolSmoothness.addEventListener('change', this.onToolSmoothnessChange, true);

        // Clear canvas
        this.clear();
    }

    clear() {
        (this.tools.rectangle as Tool).draw([
            { x: 0, y: 0},
            { x: this.options.width as number, y: this.options.height as number }
        ], {
            strokeStyle: this.options.backgroundColor,
            fillStyle: this.options.backgroundColor,
        });
        this.draftCtx.clearRect(0, 0, this.options.width as number, this.options.height as number);
    }

    getTool(): string {
        return this.tool;
    }

    setTool(tool: string) {
        if (Object.keys(this.tools).indexOf(tool) > -1) {
            this.tool = tool;
        }
    }

    getToolSettings(): ToolSettings {
        if (this.tools[this.tool] instanceof Tool) {
            return (this.tools[this.tool] as Tool).settings;
        }
        return {};
    }

    setStrokeColor(color: string) {
        this.strokeColor.value = color;
        this.setToolSetting('strokeStyle', color);
    }

    setFillColor(color: string) {
        this.fillColor.value = color;
        this.setToolSetting('fillStyle', color);
    }

    draw(tool: string, path: Coord[], settings: ToolSettings = {}) {
        if (this.tools[tool] instanceof Tool) {
            (this.tools[tool] as Tool).draw(path, settings);
        }
    }

    drawImage(img: HTMLImageElement, coord: Coord) {
        this.finalCtx.drawImage(img, coord.x, coord.y);
    }

    private setToolSetting(name: string, value: any) {
        Object.keys(this.tools).forEach(toolName => {
            if (this.tools[toolName] instanceof Tool) {
                (this.tools[toolName] as Tool).settings[name] = value;
            }
        });
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
        if (this.options.width as number > this.canvasWrap.clientWidth) {
            if (coord.x > 0) {
                coord.x = 0;
            } else if (coord.x < (this.canvasWrap.clientWidth - (this.options.width as number))) {
                coord.x = this.canvasWrap.clientWidth - (this.options.width as number);
            }
        }
        if (this.options.height as number > this.canvasWrap.clientHeight) {
            if (coord.y > 0) {
                coord.y = 0;
            } else if (coord.y < (this.canvasWrap.clientHeight - (this.options.height as number))) {
                coord.y = this.canvasWrap.clientHeight - (this.options.height as number);
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
            x: e.pageX - (this.canvasWrap.offsetLeft + this.offsetCoord.x),
            y: e.pageY - (this.canvasWrap.offsetTop + this.offsetCoord.y)
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
        this.canvasWrap.dispatchEvent(mouseEvent);
    };

    private onSave = (e: Event) => {
        e.preventDefault();
        let data = this.container.getElementsByTagName('canvas')[0].toDataURL('image/png');
        window.open(data, '_blank');
    };

    private onToolChange = (e: Event) => {
        let checkedTool = this.container.querySelectorAll('.easel__tool input:checked')[0] as HTMLInputElement;
        this.tool = checkedTool.value;
    };

    private onStrokeColorChange = (e: Event) => {
        this.setToolSetting('strokeStyle', this.strokeColor.value);
    };

    private onFillColorChange = (e: Event) => {
        this.setToolSetting('fillStyle', this.fillColor.value);
    };

    private onColorSwitchClick = (e: Event) => {
        e.preventDefault();
        let stroke = this.strokeColor.value;
        let fill = this.fillColor.value;
        this.strokeColor.value = fill;
        this.fillColor.value = stroke;
        this.setToolSetting('strokeStyle', fill);
        this.setToolSetting('fillStyle', stroke);
    };

    private onToolSizeChange = (e: Event) => {
        this.setToolSetting('lineWidth', parseInt(this.toolSize.value, 10));
    };

    private onToolOpacityChange = (e: Event) => {
        this.setToolSetting('opacity', parseInt(this.toolOpacity.value, 10));
    };

    private onToolSmoothnessChange = (e: Event) => {
        this.setToolSetting('smoothness', parseInt(this.toolSmoothness.value, 10));
    };
}