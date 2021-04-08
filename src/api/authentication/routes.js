import express from 'express';
import asyncWrapper from '../commons/async-wrapper/index.js';
import requiredPermission from '../commons/middlewares/required-permissions/index.js';
import * as authenticationController from './controller.js';

const router = express.Router();
router.post('/login',
    asyncWrapper(requiredPermission('authentication.login')),
    asyncWrapper(authenticationController.login)
);
router.post('/register',
    asyncWrapper(requiredPermission('authentication.register')),
    asyncWrapper(authenticationController.register)
);
router.post('/token',
    asyncWrapper(requiredPermission('authentication.token')),
    asyncWrapper(authenticationController.renewToken)
);

export default router;
