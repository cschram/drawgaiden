import { Canvas, HistoryEntry } from './canvas';

export type RequestCallback = (resp: any) => void;

export interface Response {
    success: boolean;
    errorMessage?: string;
}

export interface LoginRequest {
    username: string;
}

export interface JoinCanvasRequest {
    canvasID: string;
}

export interface JoinCanvasResponse extends Response {
    canvas: Canvas;
    history: HistoryEntry[];
}

export interface DrawRequest {
    entry: HistoryEntry;
}

export interface NewHistoryEvent {
    entry: HistoryEntry;
}