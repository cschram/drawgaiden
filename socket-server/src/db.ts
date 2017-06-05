import * as r from 'rethinkdb';
import { Canvas, HistoryEntry } from '../../common/canvas';

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

    getHistory(canvasID: string) {
        return r.table('history')
                    .getAll(canvasID, { index: 'canvasID' })
                    .orderBy('timestamp')
                    .run(this.conn);
    }

    getHistoryFeed(canvasID: string) {
        return r.table('history')
                    .getAll(canvasID, { index: 'canvasID' })
                    .changes()
                    .run(this.conn);
    }

    addHistory(entry: HistoryEntry) {
        entry.timestamp = Date.now();
        return r.table('history')
                    .insert([entry])
                    .run(this.conn);
    }
}

export function connect(options: r.ConnectionOptions) {
    return r.connect(options).then(conn => {
        return new Connection(conn);
    });
}