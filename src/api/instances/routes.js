import express from 'express';
import asyncWrapper from '../commons/middlewares/async-wrapper/index.js';
import playerRouter from './players/routes.js';
import userRouter from './users/routes.js';
import * as terrariaServerController from './controller.js';
import accessTokenParser from '../commons/middlewares/access-token-parser/index.js';

const router = express.Router();
router.get('/', asyncWrapper(terrariaServerController.getInstances));
router.use('/:instanceId/players', playerRouter);
router.use('/:instanceId/users', asyncWrapper(accessTokenParser), userRouter);

export default router;
