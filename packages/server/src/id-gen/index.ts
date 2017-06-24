import * as dnode from 'dnode';
import * as cuid from 'cuid';
import Logger from '../lib/logger';
import config from '../lib/config';

const logger = Logger('id-gen');

const server = dnode({
    getID: (cb: (id: string) => void) => {
        cb(cuid());
    }
});
server.listen(config.id_gen.host, config.id_gen.port);
logger.info(`ID Generation service running at ${config.id_gen.host}:${config.id_gen.port}`);