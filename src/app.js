import http from 'http';
import api from './api/index.js';
import configs from './configs/index.js';
import logger from './logger/index.js';

const PORT = configs.get('port');
const httpServer = http.createServer();
httpServer.on('request', api);
httpServer.listen(PORT, () => {
    logger.info(`API gateway is running on port ${PORT}.`);
});
