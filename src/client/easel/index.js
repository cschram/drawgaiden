import CircleTool from './tools/circle';
import ColorPickerTool from './tools/colorpicker';
import EraserTool from './tools/eraser';
import PencilTool from './tools/pencil';
import RectangleTool from './tools/rectangle';
import "../style/easel.scss";

const MOUSE_BUTTON_PRIMARY = 1;
const MOUSE_BUTTON_SCROLL = 2;
const MOUSE_BUTTON_SECONDARY = 3;

const defaultOptions = {
    width: 800,
    height: 600
};

class Easel {
    constructor(container, options) {
        this.container = container;
        this.options = Object.assign({}, defaultOptions, options);

        // Grab canvas elements and setup context
        this.canvasWrap = this.container.getElementsByClassName('easel__canvas')[0];
        this.canvases = [...this.container.getElementsByTagName('canvas')];
        this.canvases.forEach(canvas => {
            canvas.width = this.options.width;
            canvas.height = this.options.height;
        });
        this.finalCtx = this.canvases[0].getContext('2d');
        this.draftCtx = this.canvases[1].getContext('2d');
        this._setOffset({
            x: (this.canvasWrap.clientWidth / 2) - (this.options.width / 2),
            y: (this.canvasWrap.clientHeight / 2) - (this.options.height / 2)
        });

        // Setup tools
        this.tools = {
            circle: new CircleTool(this.finalCtx, this.draftCtx),
            colorpicker: new ColorPickerTool(this.finalCtx, this.draftCtx),
            eraser: new EraserTool(this.finalCtx, this.draftCtx),
            pencil: new PencilTool(this.finalCtx, this.draftCtx),
            rectangle: new RectangleTool(this.finalCtx, this.draftCtx)
        };
        let checkedTool = this.container.querySelectorAll('.easel__tool input:checked')[0];
        this.tool = checkedTool.value;

        // Initialize misc state
        this.drawing = false;
        this.moving = false;
        this.mouseCoord = { x: 0, y: 0 };

        // Bind events
        this.canvasWrap.addEventListener('mousemove', this.onMouseMove.bind(this), true);
        this.canvasWrap.addEventListener('mousedown', this.onMouseDown.bind(this), true);
        this.canvasWrap.addEventListener('mouseup', this.onMouseUp.bind(this), true);

        // Clear canvas
        this.clear();
    }

    /**
     * Public methods
     */

    clear() {
        this.tools.rectangle.draw([
            { x: 0, y: 0},
            { x: this.options.width, y: this.options.height }
        ], {
            strokeStyle: '#ffffff',
            fillStyle: '#ffffff',
        });
        this.draftCtx.clearRect(0, 0, this.options.width, this.options.height);
    }

    setTool(tool) {
        if (Object.keys(this.tools).indexOf(tool) > -1) {
            this.tool = tool;
        }
    }

    draw(tool, path, settings) {
        this.tools[tool].draw(path, settings);
    }

    /**
     * Private Methods
     */

    _setOffset(coord) {
        this.offsetCoord = coord;
        this.canvases.forEach(canvas => {
            canvas.style.left = `${coord.x}px`;
            canvas.style.top = `${coord.y}px`;
        });
    }

    _getMouseCoord(e) {
        this.mouseCoord = { x: e.pageX, y: e.pageY };
        return {
            x: e.pageX - (this.canvasWrap.offsetLeft + this.offsetCoord.x),
            y: e.pageY - (this.canvasWrap.offsetTop + this.offsetCoord.y)
        };
    }

    /**
     * Events
     */

    onMouseMove(e) {
        if (this.drawing) {
            let coord = this._getMouseCoord(e);
            this.tools[this.tool].mouseMove(coord);
        }
    }

    onMouseDown(e) {
        e.preventDefault();
        if (e.which === MOUSE_BUTTON_SCROLL) {
            this.drawing = false;
            this.moving = true;
        } else {
            this.drawing = true;
            this.moving = false;
            if (e.which === MOUSE_BUTTON_PRIMARY) {
                this.tools[this.tool].settings.primary = true;
            } else {
                this.tools[this.tool].settings.primary = false;
            }
            let coord = this._getMouseCoord(e);
            this.tools[this.tool].mouseDown(coord);
        }
    }

    onMouseUp(e) {
        if (e.which === MOUSE_BUTTON_SCROLL) {
            this.moving = false;
        } else {
            this.drawing = false;
            this.tools[this.tool].mouseUp();
        }
    }
}

export default Easel;