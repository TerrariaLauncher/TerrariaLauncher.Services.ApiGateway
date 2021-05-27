import express from 'express';
import asyncWrapper from '../../commons/middlewares/async-wrapper/index.js';
import accessTokenParser from '../../commons/middlewares/access-token-parser/access-token-parser.js';
import * as playerController from './controller.js';
import requiredGroup from '../../commons/middlewares/required-group/index.js';

const router = express.Router({
    mergeParams: true
});

function ifLevel(value) {
    return function (req, res, next) {
        if (req.query.level === value) {
            next();
        } else {
            next('route');
        }
    };
}

router.get('/', ifLevel('real-time'),
    asyncWrapper(accessTokenParser),
    asyncWrapper(requiredGroup('moderator')),
    asyncWrapper(playerController.trackPlayerSession));
router.get('/', asyncWrapper(playerController.getAllPlayers));

router.get('/:playerName', asyncWrapper(accessTokenParser));
router.get('/:playerName', ifLevel('real-time'),
    asyncWrapper(requiredGroup('moderator')),
    asyncWrapper(playerController.trackPlayerData)
);
router.get('/:playerName', ifLevel('verbose'),
    asyncWrapper(requiredGroup('moderator')),
    asyncWrapper(playerController.getPlayerData)
);
router.get('/:playerName', asyncWrapper(playerController.getPlayer));

export default router;
