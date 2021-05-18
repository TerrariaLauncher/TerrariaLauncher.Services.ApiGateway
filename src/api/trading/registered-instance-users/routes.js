import express from 'express';
import asyncWrapper from '../../commons/async-wrapper/async-wrapper.js';
import * as controller from './controller.js';

const router = express.Router();

router.all('*', controller.checkQuery);
router.get('/', asyncWrapper(controller.getAttachedInstanceUsers));

export default router;
