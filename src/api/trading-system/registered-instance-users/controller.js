import grpcClients from '../../../grpc/grpc-clients.js';
import pbMessages from '../../../grpc/messages.js';
import util from 'util';
import HttpErrors from '../../commons/http-errors/index.js';

const registeredInstanceUserService = {
    getRegisteredInstanceUsers: util.promisify(grpcClients.services.tradingSystem.registeredInstanceUserService.getRegisteredInstanceUsers)
        .bind(grpcClients.services.tradingSystem.registeredInstanceUserService),
    registerNewInstanceUser: util.promisify(grpcClients.services.tradingSystem.registeredInstanceUserService.registerNewInstanceUser)
        .bind(grpcClients.services.tradingSystem.registeredInstanceUserService),
    registerExistingInstanceUser: util.promisify(grpcClients.services.tradingSystem.registeredInstanceUserService.registerExistingInstanceUser)
        .bind(grpcClients.services.tradingSystem.registeredInstanceUserService),
    deregisterInstanceUser: util.promisify(grpcClients.services.tradingSystem.registeredInstanceUserService.deregisterInstanceUser)
        .bind(grpcClients.services.tradingSystem.registeredInstanceUserService)
}

export async function getRegisterInstanceUsers(req, res) {
    const { instanceId, userId } = req.query;
    const getRegisteredInstanceUsersRequest = new pbMessages.service.tradingSystem.GetRegisteredInstanceUsersRequest();
    getRegisteredInstanceUsersRequest.setInstanceId(instanceId);
    getRegisteredInstanceUsersRequest.setUserId(userId);
    const getRegisteredInstanceUsersResponse = await registeredInstanceUserService.getRegisteredInstanceUsers(getRegisteredInstanceUsersRequest);

    const responseObject = getRegisteredInstanceUsersResponse.toObject();
    responseObject.instanceUsers = responseObject.instanceUsersList;
    delete responseObject.instanceUsersList;

    res.json(responseObject);
}

export async function registerNewInstanceUser(req, res) {
    const { userId, instanceId } = req.query;
    const { instanceUserName, instanceUserPassword } = req.body;

    const registerNewInstanceUserRequest = new pbMessages.service.tradingSystem.RegisterNewInstanceUserRequest();
    registerNewInstanceUserRequest.setUserId(userId);
    registerNewInstanceUserRequest.setInstanceId(instanceId);
    registerNewInstanceUserRequest.setInstanceUserName(instanceUserName);
    registerNewInstanceUserRequest.setInstanceUserPassword(instanceUserPassword);
    const registerNewInstanceUserResponse = await registeredInstanceUserService.registerNewInstanceUser(registerNewInstanceUserRequest);

    res.json(registerNewInstanceUserResponse.toObject());
}

export async function registerExistingInstanceUser(req, res) {
    const { userId, instanceId } = req.query;
    const { instanceUserName, instanceUserPassword } = req.body;

    const registerExistingInstanceUserRequest = new pbMessages.service.tradingSystem.RegisterExistingInstanceUserRequest();
    registerExistingInstanceUserRequest.setUserId(userId);
    registerExistingInstanceUserRequest.setInstanceId(instanceId);
    registerExistingInstanceUserRequest.setInstanceUserName(instanceUserName);
    registerExistingInstanceUserRequest.setInstanceUserPassword(instanceUserPassword);
    const registerExistingInstanceUserResponse = await registeredInstanceUserService.registerExistingInstanceUser(registerExistingInstanceUserRequest);

    res.end();
}

export async function deregisterInstanceUser(req, res) {
    const { userId, instanceId } = req.query;
    const { instanceUserId } = req.body;

    const deregisterInstanceUserRequest = new pbMessages.service.tradingSystem.DeregisterInstanceUserRequest();
    deregisterInstanceUserRequest.setUserId(userId);
    deregisterInstanceUserRequest.setInstanceId(instanceId);
    deregisterInstanceUserRequest.setInstanceUserId(instanceUserId);
    const deregisterInstanceUserResponse = await registeredInstanceUserService.deregisterInstanceUser(deregisterInstanceUserRequest);

    res.json({
        userId,
        instanceId,
        instanceUser: {
            id: instanceUserId
        }
    });
}
