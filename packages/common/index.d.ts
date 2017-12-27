export = DrawGaiden;

declare namespace DrawGaiden {
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
        layers: number;
        backgroundColor: string;
        snapshots?: string[];
    }
    
    namespace Protocol {
        export interface Response {
            success: boolean;
            errorMessage?: string;
        }
        
        export type Callback<T extends Response = Response> = (resp: T) => void;
        
        export interface LoginRequest {
            username: string;
        }
        
        export interface CreateCanvasRequest {
            id?: string;
        }
        
        export interface CreateCanvasResponse extends Response {
            id?: string;
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
    }
}