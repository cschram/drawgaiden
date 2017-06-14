import { Canvas, HistoryEntry, User, Coord } from './canvas';

export interface Response {
    success: boolean;
    errorMessage?: string;
}

export type Callback<T extends Response = Response> = (resp: T) => void;

export interface LoginRequest {
    username: string;
}

export interface JoinCanvasRequest {
    canvasID: string;
}

export interface JoinCanvasResponse extends Response {
    canvas?: Canvas;
    history?: HistoryEntry[];
    users?: User[];
}

export interface DrawRequest {
    entry: HistoryEntry;
}

export interface SetPositionRequest {
    coord: Coord;
}

export interface NewHistoryEvent {
    entry: HistoryEntry;
}

export interface UserEvent {
    user: User;
}