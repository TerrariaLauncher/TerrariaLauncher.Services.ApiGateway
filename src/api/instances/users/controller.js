import grpc from '@grpc/grpc-js';
import grpcClients from '../../../grpc/grpc-clients.js';
import pbMessages from '../../../grpc/messages.js';
import HttpErrors from '../../commons/http-errors/index.js';
import util from 'util';

const instanceUserService = {
    updateUser: util.promisify(grpcClients.services.instanceGateway.instanceUserManagement.updateUser)
        .bind(grpcClients.services.instanceGateway.instanceUserManagement)
};

const registeredInstanceUserService = {
    checkIfInstanceUserIsRegistered: util.promisify(grpcClients.services.tradingSystem.registeredInstanceUserService.checkIfInstanceUserIsRegistered)
        .bind(grpcClients.services.tradingSystem.registeredInstanceUserService)
}

export function ifReset(req, res, next) {
    if (req.query.type === 'reset') {
        next();
    }
    else {
        next('route')
    }
}

export async function ifOwner(req, res, next) {
    const requestMessage = new pbMessages.service.tradingSystem.CheckIfInstanceUserIsRegisteredRequest();
    requestMessage.setInstanceId(req.params.instanceId);
    requestMessage.setInstanceUserId(req.params.instanceUserId);
    const responseMessage = await registeredInstanceUserService.checkIfInstanceUserIsRegistered(requestMessage);
    if (responseMessage.getIsRegistered() && responseMessage.getUserId() == req.auth.user.id) {
        next();
    } else {
        next('route');
    }
}

export function createUser(req, res) {
    res.end();
}

export function deleteUser(req, res) {
    res.end();
}

export function changePassword(req, res) {
    res.end();
}

export async function resetPassword(req, res) {
    const { instanceId, instanceUserId } = req.params;
    const { newPassword } = req.body;
    const request = new pbMessages.service.instanceGateway.UpdateUserRequest();
    request.setInstanceId(instanceId);
    const payload = new pbMessages.instancePlugins.instanceManagement.UpdateUserRequest();
    payload.setId(instanceUserId);
    payload.setPassword(newPassword);
    request.setPayload(payload);

    const response = await instanceUserService.updateUser(request);
    res.json({
        user: response.toObject()
    });
}
