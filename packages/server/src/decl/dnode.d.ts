declare namespace DNode {
    interface DNodeServer {
        listen(host: string, port: number): void;
        end(): void;
    }

    interface DNodeClient {
        on(event: string, handler: Function): void;
        end(): void;
    }

    interface DNodeServerOpts {
        weak?: boolean;
        [name: string]: any;
    }

    interface DNodeRemote {
        [name: string]: any;
    }

    interface DNode {
        (opts: DNodeServerOpts): DNodeServer;
        connect(host: string, port: number, cb?: (remote: DNodeRemote) => void): DNodeClient;
    }
}

declare module "dnode" {
    var dnode: DNode.DNode;
    export = dnode;
} 