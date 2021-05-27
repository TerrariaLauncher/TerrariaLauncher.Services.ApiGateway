import express from 'express';
import asyncWrapper from '../../commons/middlewares/async-wrapper/async-wrapper.js';
import requiredGroup from '../../commons/middlewares/required-group/index.js';
import * as controller from './controller.js';

const router = express.Router({
    mergeParams: true
});

router.post('/', controller.createUser);
router.delete('/:instanceUserId', controller.deleteUser);

router.patch('/:instanceUserId/password',
    controller.ifReset,
    asyncWrapper(requiredGroup('registered')),
    asyncWrapper(controller.ifOwner),
    asyncWrapper(controller.resetPassword)
);
router.patch('/:instanceUserId/password',
    controller.ifReset,
    asyncWrapper(requiredGroup('administrator')),
    asyncWrapper(controller.resetPassword)
);
router.patch('/:instanceUserId/password',
    controller.changePassword
);

export default router;
