import * as Hapi from 'hapi';


export interface HealthMonitorOptions {
    port: number;
}

export type HealthStatus = 'OK' | 'ERROR';

export class HealthMonitor {
    private options: HealthMonitorOptions;
    private status: HealthStatus;
    private errorMessage: string;
    private server: Hapi.Server;

    constructor(options: HealthMonitorOptions) {
        this.options = options;
        this.status = 'OK';
        this.errorMessage = '';
        this.server = new Hapi.Server();
        this.server.connection({ port: options.port });
        this.server.route({
            method: 'GET',
            path: '/status',
            handler: this.statusHandler
        });
        this.server.start(err => {
            if (err) {
                this.status = 'ERROR';
                this.errorMessage = err.toString();
            }
        });
    }

    error(message: string) {
        this.status = 'ERROR';
        this.errorMessage = message;
    }

    getStatus(): HealthStatus {
        return this.status;
    }

    getServer(): Hapi.Server {
        return this.server;
    }

    private statusHandler = (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => {
        return reply({
            status: this.status,
            errorMessage: this.errorMessage
        });
    };
}