import grpcClients from '../../../grpc/grpc-clients.js';
import pbMessages from '../../../grpc/messages.js';
import util from 'util';
import HttpErrors from '../../commons/http-errors/index.js';

const registeredInstanceUserService = {
    getRegisteredInstanceUsers: util.promisify(grpcClients.services.tradingSystem.registeredInstanceUserService.getRegisteredInstanceUsers)
        .bind(grpcClients.services.tradingSystem.registeredInstanceUserService)
}

export function checkQuery(req, res, next) {
    const { instanceId, userId } = req.query;
    if (instanceId && userId) {
        next();
    } else {
        throw new HttpErrors.BadRequest();
    }
}

export async function getAttachedInstanceUsers(req, res) {
    const { instanceId, userId } = req.query;
    const getRegisteredInstanceUsersRequest = new pbMessages.service.tradingSystem.GetRegisteredInstanceUsersRequest();
    getRegisteredInstanceUsersRequest.setInstanceId(instanceId);
    getRegisteredInstanceUsersRequest.setUserId(userId);
    const getRegisteredInstanceUsersResponse = await registeredInstanceUserService.getRegisteredInstanceUsers(getRegisteredInstanceUsersRequest);

    const registeredInstanceUsers = [];
    for (const registeredInstanceUser of getRegisteredInstanceUsersResponse.getRegisteredInstanceUsersList()) {
        registeredInstanceUsers.push({
            id: registeredInstanceUser.getInstanceUserId(),
            name: registeredInstanceUser.getInstanceUserName()
        });
    }

    res.json({
        instanceId: instanceId,
        userId: userId,
        registeredInstanceUsers: registeredInstanceUsers
    });
}
