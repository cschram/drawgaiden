import { readFileSync } from 'fs';
import { join } from 'path';

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

const path = join(__dirname, '../../../config/server.json');
const data = readFileSync(path, { encoding: 'utf-8' });
const config: Config = JSON.parse(data);
export default config;