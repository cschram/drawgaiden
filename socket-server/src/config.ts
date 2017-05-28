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
    logDirectory: string;
}

const data = readFileSync('../config/socket-server.json', { encoding: 'utf-8' });
const config: Config = JSON.parse(data);
export default config;