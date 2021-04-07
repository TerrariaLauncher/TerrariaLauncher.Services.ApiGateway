import express from 'express';
import cookieParser from 'cookie-parser';
import accessTokenParser from './commons/middlewares/access-token-parser/index.js';
import errorHandler from './commons/middlewares/error-handler/index.js';

import authenticationRouter from './authentication/routes.js';
import playerRouter from './players/routes.js';
import shopRouter from './shop/routes.js';

const api = express();

api.use(cookieParser());
api.use(express.json());

api.use('/authentication', authenticationRouter);
api.use('/users', playerRouter);
api.use('/shop', shopRouter);

api.use(errorHandler);

export default api;
