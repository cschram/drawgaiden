import * as Hapi from 'hapi';

export type HealthStatus = 'OK' | 'ERROR';

export class HealthMonitor {
    private status: HealthStatus;
    private errorMessage: string;

    constructor(server: Hapi.Server) {
        this.status = 'OK';
        this.errorMessage = '';
        server.route({
            method: 'GET',
            path: '/status',
            handler: this.statusHandler
        });
    }

    error(message: string) {
        this.status = 'ERROR';
        this.errorMessage = message;
    }

    getStatus(): HealthStatus {
        return this.status;
    }

    private statusHandler = (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => {
        return reply({
            status: this.status,
            errorMessage: this.errorMessage
        });
    };
}