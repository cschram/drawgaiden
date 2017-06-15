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

interface EaselOptions {
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

export default class Easel {
    private container: HTMLElement;
    private options: EaselOptions;
    private canvasWrap: HTMLElement;
    private offsetTargets: HTMLElement[];

    private finalCtx: CanvasRenderingContext2D;
    private draftCtx: CanvasRenderingContext2D;

    private toolOptions: HTMLInputElement[];
    private strokeColor: HTMLInputElement;
    private fillColor: HTMLInputElement;
    private colorSwitch: HTMLInputElement;
    private toolSize: HTMLInputElement;

    private tools: { [name: string]: Tool };
    private tool: string;

    private drawing: boolean;
    private moving: boolean;
    private mouseCoord: Coord;
    private offsetCoord: Coord;
    private lastOffsetCoord: Coord;
    private anchorCoord: Coord;

    constructor(container: HTMLElement, options: EaselOptions = null) {
        this.container = container;
        this.options = Object.assign({}, defaultOptions, options);

        // Grab canvas elements and setup context
        this.canvasWrap = this.container.getElementsByClassName('easel__canvas')[0] as HTMLElement;
        const finalCanvas = this.container.getElementsByClassName('easel__canvas-final')[0] as HTMLCanvasElement;
        const draftCanvas = this.container.getElementsByClassName('easel__canvas-draft')[0] as HTMLCanvasElement;
        const canvases = [finalCanvas, draftCanvas];
        const overlays = Array.from(this.container.getElementsByClassName('easel__overlay') as NodeListOf<HTMLElement>);
        this.offsetTargets = overlays.concat(canvases);
        canvases.forEach(canvas => {
            canvas.width = this.options.width;
            canvas.height = this.options.height;
        });
        overlays.forEach(overlay => {
            overlay.style.width = `${this.options.width}px`;
            overlay.style.height = `${this.options.height}px`;
        });
        this.finalCtx = finalCanvas.getContext('2d');
        this.draftCtx = draftCanvas.getContext('2d');
        this.setOffset({
            x: (this.canvasWrap.clientWidth / 2) - (this.options.width / 2),
            y: (this.canvasWrap.clientHeight / 2) - (this.options.height / 2)
        });

        // Setup tools
        this.toolOptions = Array.from(this.container.querySelectorAll('[name=tool]')) as HTMLInputElement[];
        this.strokeColor = this.container.querySelectorAll('[name=stroke-color]')[0] as HTMLInputElement;
        this.fillColor = this.container.querySelectorAll('[name=fill-color]')[0] as HTMLInputElement;
        this.colorSwitch = this.container.querySelectorAll('[name=color-switch]')[0] as HTMLInputElement;
        this.toolSize = this.container.querySelectorAll('[name=size]')[0] as HTMLInputElement;

        let onPick = (type, color) => {
            if (type === 'stroke') {
                this.setStrokeColor(color);
            } else {
                this.setFillColor(color);
            }
        };
        this.tools = {
            circle: new CircleTool(this.finalCtx, this.draftCtx),
            colorpicker: new ColorPickerTool(this.finalCtx, this.draftCtx, {}, onPick),
            eraser: new EraserTool(this.finalCtx, this.draftCtx, {}, this.options.backgroundColor),
            pencil: new PencilTool(this.finalCtx, this.draftCtx),
            rectangle: new RectangleTool(this.finalCtx, this.draftCtx)
        };
        let checkedTool = this.container.querySelectorAll('.easel__tool input:checked')[0] as HTMLInputElement;
        this.tool = checkedTool.value;

        // Initialize misc state
        this.drawing = false;
        this.moving = false;
        this.mouseCoord = { x: 0, y: 0 };

        // Bind events
        this.canvasWrap.addEventListener('mousemove', this.onMouseMove, true);
        this.canvasWrap.addEventListener('mousedown', this.onMouseDown, true);
        this.canvasWrap.addEventListener('mouseup', this.onMouseUp, true);
        this.toolOptions.forEach(option => {
            option.addEventListener('change', this.onToolChange, true);
        });
        this.strokeColor.addEventListener('change', this.onStrokeColorChange, true);
        this.fillColor.addEventListener('change', this.onFillColorChange, true);
        this.colorSwitch.addEventListener('click', this.onColorSwitchClick, true);
        this.toolSize.addEventListener('change', this.onToolSizeChange, true);

        // Clear canvas
        this.clear();
    }

    clear() {
        this.tools.rectangle.draw([
            { x: 0, y: 0},
            { x: this.options.width, y: this.options.height }
        ], {
            strokeStyle: this.options.backgroundColor,
            fillStyle: this.options.backgroundColor,
        });
        this.draftCtx.clearRect(0, 0, this.options.width, this.options.height);
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
        return this.tools[this.tool].settings;
    }

    setStrokeColor(color: string) {
        this.strokeColor.value = color;
        this.setToolSetting('strokeStyle', color);
    }

    setFillColor(color: string) {
        this.fillColor.value = color;
        this.setToolSetting('fillStyle', color);
    }

    draw(tool: string, path: Coord[], settings: ToolSettings = null) {
        this.tools[tool].draw(path, settings);
    }

    drawImage(img: HTMLImageElement, coord: Coord) {
        this.finalCtx.drawImage(img, coord.x, coord.y);
    }

    private setToolSetting(name: string, value: any) {
        Object.keys(this.tools).forEach(toolName => {
            this.tools[toolName].settings[name] = value;
        });
    }

    private setOffset(coord: Coord) {
        if (this.options.width > this.canvasWrap.clientWidth) {
            if (coord.x > 0) {
                coord.x = 0;
            } else if (coord.x < (this.canvasWrap.clientWidth - this.options.width)) {
                coord.x = this.canvasWrap.clientWidth - this.options.width;
            }
        }
        if (this.options.height > this.canvasWrap.clientHeight) {
            if (coord.y > 0) {
                coord.y = 0;
            } else if (coord.y < (this.canvasWrap.clientHeight - this.options.height)) {
                coord.y = this.canvasWrap.clientHeight - this.options.height;
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

    private onMouseMove = (e: MouseEvent) => {
        if (this.moving) {
            let diff = {
                x: this.anchorCoord.x - e.pageX,
                y: this.anchorCoord.y - e.pageY
            };
            this.setOffset({
                x: this.lastOffsetCoord.x - diff.x,
                y: this.lastOffsetCoord.y - diff.y
            });
        } else {
            let coord = this.getMouseCoord(e);
            if (this.drawing) {
                this.tools[this.tool].mouseMove(coord);
            }
            if (this.options.onMouseMove) {
                this.options.onMouseMove(coord);
            }
        }
    };

    private onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        if (e.ctrlKey) {
            this.moving = true;
            this.lastOffsetCoord = this.offsetCoord;
            this.anchorCoord = {
                x: e.pageX,
                y: e.pageY
            };
        } else {
            this.drawing = true;
            if (e.which === MOUSE_BUTTON_PRIMARY) {
                this.tools[this.tool].settings.primary = true;
            } else {
                this.tools[this.tool].settings.primary = false;
            }
            let coord = this.getMouseCoord(e);
            this.tools[this.tool].mouseDown(coord);
        }
    };

    private onMouseUp = (e: MouseEvent) => {
        if (e.ctrlKey) {
            this.moving = false;
        } else {
            this.drawing = false;
            let path = this.tools[this.tool].mouseUp();
            this.options.onDraw(path);
        }
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
        this.setToolSetting('lineWidth', this.toolSize.value);
    };
}