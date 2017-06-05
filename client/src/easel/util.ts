export interface Coord {
    x: number;
    y: number;
}

export interface ToolSettings {
    strokeStyle?: string;
    fillStyle?: string;
    lineWidth?: number;
    lineCap?: string;
    lineJoin?: string;
    globalCompositeOperation?: string;
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