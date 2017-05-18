import CircleTool from './tools/circle';
import ColorPickerTool from './tools/colorpicker';
import EraserTool from './tools/eraser';
import PencilTool from './tools/pencil';
import RectangleTool from './tools/rectangle';
import "../style/easel.scss";

const defaultOptions = {
    width: 800,
    height: 600
};

class Easel {
    constructor(container, options) {
        this.container = container;
        this.options = Object.assign({}, defaultOptions, options);

        // let canvases = [...container.getElementsByTagName('canvas')];
        // if (canvases.length !== 2) {
        //     throw new Error('Missing canvas tag(s).');
        // }
        // canvases.forEach(canvas => {
        //     canvas.width = this.options.width;
        //     canvas.height = this.options.height;
        // });
        // this.draftCtx = canvases[0].getContext('2d');
        // this.finalCtx = canvases[1].getContext('2d');
        // this.tools = {
        //     circle: new CircleTool(this.finalCtx, this.draftCtx),
        //     colorpicker: new ColorPickerTool(this.finalCtx, this.draftCtx),
        //     eraser: new EraserTool(this.finalCtx, this.draftCtx),
        //     pencil: new PencilTool(this.finalCtx, this.draftCtx),
        //     rectangle: new RectangleTool(this.finalCtx, this.draftCtx)
        // };
        // this.tool = this.options.defaultTool;

        // this.offsetCoord = { x: 0, y: 0 };
    }

    /**
     * Public methods
     */

    clear() {
        this.finalCtx.clearRect(0, 0, this.options.width, this.options.height);
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
    _getMouseCoord(e) {
        return {
            x: e.pageX,
            y: e.pageY
        };
    }

    /**
     * Events
     */

    onMouseMove(e) {
        let coord = this._getMouseCoord(e);
        this.tools[this.tool].mouseMove(coord);
    }

    onMouseDown(e) {
        
    }
}

export default Easel;