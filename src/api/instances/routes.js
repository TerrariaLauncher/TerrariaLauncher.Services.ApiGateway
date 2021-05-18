import express from 'express';
import asyncWrapper from '../commons/async-wrapper/index.js';
import playerRouter from './players/routes.js';
import * as terrariaServerController from './controller.js';

const specifiedInstanceRouter = express.Router({
    mergeParams: true
});
specifiedInstanceRouter.use('/players', playerRouter);

const router = express.Router();
router.get('/', asyncWrapper(terrariaServerController.getInstances));
router.use('/:instanceId', specifiedInstanceRouter);

export default router;
