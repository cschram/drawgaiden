import * as r from 'rethinkdb';
import { Canvas, HistoryEntry } from '../../../defs/canvas';

function nanoseconds() {
    let time = process.hrtime();
    return ((+time[0]) * 1e9) + (+time[1]);
}

export class Connection {
    private conn: r.Connection;

    constructor(connection: r.Connection) {
        this.conn = connection;
    }

    getCanvas(id: string) {
        return r.table('canvases')
                .get(id)
                .run(this.conn);
    }

    getCanvasIds() {
        return r.table('canvases').map((doc) => doc('id')).run(this.conn);
    }

    updateCanvas(canvas: Canvas) {
        return r.table('canvases')
                .get(canvas.id)
                .update(canvas)
                .run(this.conn);
    }

    getHistory(canvasID: string) {
        return r.table('history')
                .getAll(canvasID, { index: 'canvasID' })
                .orderBy('timestamp')
                .run(this.conn);
    }

    getHistoryCount(canvasID: string) {
        return r.table('history')
                .getAll(canvasID, { index: 'canvasID' })
                .count()
                .run(this.conn);
    }

    getHistoryFeed(canvasID: string) {
        return r.table('history')
                .getAll(canvasID, { index: 'canvasID' })
                .changes()
                .run(this.conn);
    }

    addHistory(entry: HistoryEntry) {
        entry.timestamp = nanoseconds();
        return r.table('history')
                .insert([entry])
                .run(this.conn);
    }

    clearHistory(canvasID: string, limit = 0) {
        if (limit > 0) {
            return r.table('history')
                    .getAll(canvasID, { index: 'canvasID' })
                    .orderBy('timestamp')
                    .limit(limit)
                    .delete()
                    .run(this.conn);
        } else {
            return r.table('history')
                    .getAll(canvasID, { index: 'canvasID' })
                    .delete()
                    .run(this.conn);
        }
    }
}

export function connect(options: r.ConnectionOptions) {
    return r.connect(options).then(conn => {
        return new Connection(conn);
    });
}