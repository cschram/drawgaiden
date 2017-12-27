export interface Coord {
    x: number;
    y: number;
}

export interface Layer {
    id: number;
    finalCanvas: HTMLCanvasElement;
    finalCtx: CanvasRenderingContext2D;
    draftCanvas: HTMLCanvasElement;
    draftCtx: CanvasRenderingContext2D;
}

export interface ToolSettings {
    layer?: number;
    strokeStyle?: string;
    fillStyle?: string;
    lineWidth?: number;
    lineCap?: string;
    lineJoin?: string;
    opacity?: number;
    globalCompositeOperation?: string;
    smoothness?: number;
    primary?: boolean;
    sendUpdates?: boolean;
}

export function toHex(v: number): string {
    const hex = v.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + toHex(r) + toHex(g) + toHex(b);
}