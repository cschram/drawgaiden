import { Canvas, HistoryEntry, User, Coord } from './canvas';

export interface Request {
    callback: (resp: any) => void;
}

export interface Response {
    success: boolean;
    errorMessage?: string;
}

export interface LoginRequest extends Request {
    username: string;
}

export interface JoinCanvasRequest extends Request {
    canvasID: string;
}

export interface JoinCanvasResponse extends Response {
    canvas: Canvas;
    history: HistoryEntry[];
    users: User[];
}

export interface DrawRequest extends Request {
    entry: HistoryEntry;
}

export interface SetPositionRequest extends Request {
    coord: Coord;
}

export interface NewHistoryEvent {
    entry: HistoryEntry;
}

export interface UserEvent {
    user: User;
}