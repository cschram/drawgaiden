export interface ToolSettings {
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

export interface Coord {
    x: number;
    y: number;
}

export interface HistoryEntry {
    id?: string;
    canvasID: string;
    timestamp?: number;
    username: string;
    toolName: string;
    path: Coord[];
    settings: ToolSettings;
}

export interface User {
    username: string;
    canvasID: string;
    mousePosition: Coord;
}

export interface Cursor {
    username: string;
    coord: Coord;
}

export interface Canvas {
    id?: string;
    width: number;
    height: number;
    backgroundColor: string;
    snapshot?: string;
}