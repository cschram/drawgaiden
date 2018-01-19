import * as winston from 'winston';
import { join } from 'path';
import config from './config';

export type Logger = winston.LoggerInstance;

export function createLogger(name: string): Logger {
    if (process.env.NODE_APP_INSTANCE) {
        name = `${name}-${parseInt(process.env.NODE_APP_INSTANCE, 10)}`;
    }
    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                json : false,
                timestamp: true
            }),
            new winston.transports.File({
                json: false,
                timestamp: true,
                filename: join(config.logDirectory, `${name}.debug.log`)
            })
        ],
        exceptionHandlers: [
            new winston.transports.Console({
                json: false,
                timestamp: true
            }),
            new winston.transports.File({
                json: false,
                timestamp: true,
                filename: join(config.logDirectory, `${name}.error.log`)
            })
        ]
    });
}