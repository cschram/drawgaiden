import * as r from 'rethinkdb';

export class Connection {
    private conn: r.Connection;

    constructor(connection: r.Connection) {
        this.conn = connection;
    }

    getCanvas(id: string) {
        return r.table('canvas').get(id).run(this.conn);
    }
}

export function connect(options: r.ConnectionOptions) {
    return r.connect(options).then(conn => {
        return new Connection(conn);
    });
}