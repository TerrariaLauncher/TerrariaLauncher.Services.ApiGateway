import express from 'express';
import registeredInstanceUserRouter from './registered-instance-users/routes.js';

const router = express.Router();

router.use('/registered-instance-users', registeredInstanceUserRouter);

export default router;
