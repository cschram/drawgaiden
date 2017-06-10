import * as r from 'rethinkdb';
import { Canvas, HistoryEntry, User } from '../../../defs/canvas';

// Current timestamp in nanoseconds
function nanoseconds() {
    let time = process.hrtime();
    return ((+time[0]) * 1e9) + (+time[1]);
}

/**
 * Database connection wrapper.
 * Abstracts any necessary database operations.
 */
export class Connection {
    private conn: r.Connection;

    constructor(connection: r.Connection) {
        this.conn = connection;
    }

    /******************************************************
     * Canvas operations
     *****************************************************/

    /**
     * Get canvas details by id.
     * @param id ID of the canvas.
     */
    getCanvas(id: string) {
        return r.table('canvases')
                .get(id)
                .run(this.conn);
    }

    /**
     * Retrieve a list of every canvas ID.
     */
    getCanvasIds() {
        return r.table('canvases').map((doc) => doc('id')).run(this.conn);
    }

    /**
     * Update canvas details.
     * @param canvas Updated canvas details. Must contain canvas ID.
     */
    updateCanvas(canvas: Canvas) {
        if (!canvas.id) {
            return Promise.reject('Cannot update canvas with missing ID.');
        }
        return r.table('canvases')
                .get(canvas.id)
                .update(canvas)
                .run(this.conn);
    }

    /******************************************************
     * History operations
     *****************************************************/

    /**
     * Retrieve history for a canvas.
     * @param canvasID ID of the canvas to retrieve history for.
     */
    getHistory(canvasID: string) {
        return r.table('history')
                .getAll(canvasID, { index: 'canvasID' })
                .orderBy('timestamp')
                .run(this.conn);
    }

    /**
     * Retrieve history count for a canvas.
     * @param canvasID ID of the canvas to retrieve history count for.
     */
    getHistoryCount(canvasID: string) {
        return r.table('history')
                .getAll(canvasID, { index: 'canvasID' })
                .count()
                .run(this.conn);
    }

    /**
     * Create and return a changefeed for a canvases history.
     * @param canvasID ID of the canvas to create a changefeed for.
     */
    getHistoryFeed(canvasID: string) {
        return r.table('history')
                .getAll(canvasID, { index: 'canvasID' })
                .changes()
                .run(this.conn);
    }

    /**
     * Add a new history entry. Timestamp is created for the entry.
     * @param entry History entry details.
     */
    addHistory(entry: HistoryEntry) {
        entry.timestamp = nanoseconds();
        return r.table('history')
                .insert([entry])
                .run(this.conn);
    }

    /**
     * Clear history for a canvas.
     * @param canvasID ID of the canvas to clear history for.
     * @param limit Optional limit for the number of entries to clear.
     */
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

    /******************************************************
     * User operations
     *****************************************************/

    /**
     * Retrieve users currently collaborating on a canvas.
     * @param canvasID ID of the canvas to retrieve users for.
     */
    getUsers(canvasID: string) {
        return r.table('users')
                .getAll(canvasID, { index: 'canvasID' })
                .run(this.conn);
    }

    /**
     * Create and return a changefeed for canvas users.
     * @param canvasID ID of the canvas to create a changefeed for.
     */
    getUserFeed(canvasID: string) {
        return r.table('users')
                .getAll(canvasID, { index: 'canvasID' })
                .changes()
                .run(this.conn);
    }

    /**
     * Creates a new user
     * @param username Username of the new user.
     */
    async createUser(username: string) {
        let existing = await r.table('users').get(username).run(this.conn);
        if (existing) {
            return Promise.reject('User already exists.');
        } else {
            return r.table('users')
                    .insert([{
                        username,
                        canvasID: '',
                        mousePosition: {
                            x: 0,
                            y: 0
                        }
                    }])
                    .run(this.conn);
        }
    }

    /**
     * Updates a users details.
     * @param user Updated user details.
     */
    updateUser(user: User) {
        return r.table('users')
                .update(user)
                .run(this.conn);
    }
}

/**
 * Create a new database connection wrapper.
 * @param options Connection options.
 */
export function connect(options: r.ConnectionOptions) {
    return r.connect(options).then(conn => {
        return new Connection(conn);
    });
}