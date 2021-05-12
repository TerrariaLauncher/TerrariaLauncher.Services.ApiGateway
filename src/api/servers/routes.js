import express from 'express';
import asyncWrapper from '../commons/async-wrapper/index.js';
import playerRouter from './players/routes.js';
import shopRouter from './shop/routes.js';
import * as terrariaServerController from './controller.js';

const specifiedServerRouter = express.Router({
    mergeParams: true
});
specifiedServerRouter.use('/players', playerRouter);
specifiedServerRouter.use('/shop', shopRouter);

const router = express.Router();
router.get('/', asyncWrapper(terrariaServerController.getServerInstances));
router.use('/:serverIndex', specifiedServerRouter);

export default router;
