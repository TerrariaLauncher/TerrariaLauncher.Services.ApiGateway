import express from 'express';
import asyncWrapper from '../../commons/middlewares/async-wrapper/async-wrapper.js';
import requiredGroup from '../../commons/middlewares/required-group/index.js';
import * as controller from './controller.js';

const router = express.Router();

export function checkQueryString(req, res, next) {
    const { instanceId, userId } = req.query;
    if (instanceId && userId) {
        next();
    } else {
        throw new HttpErrors.BadRequest();
    }
}

export async function ifOwner(req, res, next) {
    if (req.query.userId != req.auth.user.id) {
        next('route');
    } else {
        next();
    }
}

function ifRegisterExisting(req, res, next) {
    if (req.query.type === 'existing') {
        next()
    } else {
        next('route');
    }
}

router.all('*', checkQueryString);
router.get('/',
    asyncWrapper(requiredGroup('registered')),
    ifOwner,
    asyncWrapper(controller.getRegisterInstanceUsers)
);
router.get('/',
    asyncWrapper(requiredGroup('administrator')),
    asyncWrapper(controller.getRegisterInstanceUsers)
);

router.post('/', ifRegisterExisting,
    asyncWrapper(requiredGroup('registered')),
    ifOwner,
    asyncWrapper(controller.registerExistingInstanceUser)
);
router.post('/',
    asyncWrapper(requiredGroup('registered')),
    ifOwner,
    asyncWrapper(controller.registerNewInstanceUser)
);

router.delete('/',
    asyncWrapper(requiredGroup('registered')),
    ifOwner,
    asyncWrapper(controller.deregisterInstanceUser)
);

export default router;
