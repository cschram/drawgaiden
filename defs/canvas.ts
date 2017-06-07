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

export interface Coord {
    x: number;
    y: number;
}

export interface HistoryEntry {
    id?: string;
    canvasID: string;
    userName: string;
    toolName: string;
    path: Coord[];
    settings: ToolSettings;
}

export interface Cursor {
    userName: string;
    coord: Coord;
}

export interface Canvas {
    id?: string;
    width: number;
    height: number;
    backgroundColor: string;
    snapshot?: string;
}