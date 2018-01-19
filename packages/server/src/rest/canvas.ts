import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Canvas, HistoryEntry } from '@drawgaiden/common';
import config from '../lib/config';
import { Connection } from '../lib/db';
import { Logger } from '../lib/logger';
import { flatten } from '../lib/canvas';

export function setup(server: Hapi.Server, db: Connection, logger: Logger) {
    server.route({
        method: 'GET',
        path: '/canvas/{id}',
        handler: async (request, reply) => {
            try {
                const canvas: Canvas = await db.getCanvas(request.params.id);
                if (!canvas) {
                    reply(Boom.notFound());
                }
                reply(canvas);
            } catch (error) {
                logger.error(error);
                reply(Boom.badImplementation());
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/canvas/{id}/history',
        handler: async (request, reply) => {
            try {
                const canvas: Canvas = await db.getCanvas(request.params.id);
                if (!canvas) {
                    reply(Boom.notFound());
                }
                const history: HistoryEntry[] = await (await db.getHistory(request.params.id)).toArray();
                reply(history);
            } catch (error) {
                logger.error(error);
                reply(Boom.badImplementation());
            }
        }
    });
    
    server.route({
        method: 'GET',
        path: '/canvas/{id}.png',
        handler: async (request, reply) => {
            try {
                const canvas: Canvas = await db.getCanvas(request.params.id);
                if (!canvas) {
                    reply(Boom.notFound());
                }
                const history: HistoryEntry[] = await (await db.getHistory(request.params.id)).toArray();
                const image = flatten(canvas, history);
                reply(image);
            } catch (error) {
                logger.error(error);
                reply(Boom.badImplementation());
            }
        }
    });
}