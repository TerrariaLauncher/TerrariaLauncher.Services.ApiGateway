import express from 'express';
import asyncWrapper from '../../commons/async-wrapper/index.js';
import * as playerController from './controller.js';

const router = express.Router({
    mergeParams: true
});

router.get('/', asyncWrapper(playerController.getPlayers));
router.get('/:playerName', asyncWrapper(playerController.getPlayer));

export default router;
