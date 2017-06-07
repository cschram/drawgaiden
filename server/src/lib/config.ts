import { readFileSync } from 'fs';

export interface Config {
    db: {
        host: string;
        port: number;
        db: string;
        authKey?: string;
    };
    socket: {
        host: string;
        port: number;
    };
    janitor: {
        jobInterval: number;
        historyThreshold: number;
    };
    logDirectory: string;
}

const path = '../config/server.json';
const data = readFileSync(path, { encoding: 'utf-8' });
const config: Config = JSON.parse(data);
export default config;