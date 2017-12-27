import { readFileSync } from 'fs';
import { resolve } from 'path';
export interface Config {
    db: {
        host: string;
        port: number;
        db: string;
        authKey?: string;
    };
    redis: {
        host: string;
        port: number;
    };
    socket: {
        host: string;
        port: number;
    };
    janitor: {
        jobInterval: number;
        canvasExpirationAge: number;
        historyThreshold: number;
        monitorPort: number;
    };
    defaultCanvas: {
        width: number;
        height: number;
        layers: number;
        backgroundColor: string;
    };
    logDirectory: string;
}
if (!process.env.CONFIG_FILE) {
    console.error('Missing CONFIG_FILE');
    process.exit();
}
const data = readFileSync(process.env.CONFIG_FILE, { encoding: 'utf-8' });
const config: Config = JSON.parse(data);
export default config;