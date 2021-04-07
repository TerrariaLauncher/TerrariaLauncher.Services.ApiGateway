import express from 'express';
import asyncWrapper from '../commons/async-wrapper/index.js';
import * as authenticationController from './controller.js';

const router = express.Router();
router.post('/login', asyncWrapper(authenticationController.login));
router.post('/register', asyncWrapper(authenticationController.register));
router.post('/token', asyncWrapper(authenticationController.renewToken));

export default router;
