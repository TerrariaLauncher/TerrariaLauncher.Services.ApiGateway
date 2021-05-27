import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import configs from '../configs/index.js';
import asyncWrapper from './commons/middlewares/async-wrapper/index.js';
import accessTokenParser from './commons/middlewares/access-token-parser/index.js';
import errorHandler from './commons/middlewares/error-handler/index.js';

import authenticationRouter from './authentication/routes.js';
import instanceRouter from './instances/routes.js';
import tradingSystemRouter from './trading-system/routes.js';

const rootRouter = express.Router();
rootRouter.use('/authentication', authenticationRouter);
rootRouter.use('/instances', instanceRouter);
rootRouter.use('/trading-system',
    asyncWrapper(accessTokenParser),
    tradingSystemRouter
);

const api = express();
api.use(cors({
    origin: configs.get('allowOrigins'),
    credentials: true
}));
api.use(cookieParser());
api.use(express.json());
api.use('/api', rootRouter);
api.use(errorHandler);

export default api;
