import gRpcClients from '../../../grpc/grpc-clients.js';
import protoMessages from '../../../grpc/messages.js';
import HttpErrors from '../http-errors/http-errors.js';
import util from 'util';

const doesGroupContainsPermission = util.promisify(gRpcClients.services.authentication.authorization.doesGroupContainsPermission)
    .bind(gRpcClients.services.authentication.authorization);

export function requiredPermissionWrapper(permission) {
    return function (func) {
        return async function (req, res, next) {
            const group = req.auth?.group ?? 'guest';

            const requestMessage = new protoMessages.service.authentication.DoesGroupContainsPermissionRequest();
            requestMessage.setGroup(group);
            requestMessage.setPermission(permission);
            const responseMessage = await doesGroupContainsPermission(requestMessage);

            if (!responseMessage.getContains()) {
                throw new HttpErrors.Forbidden(`Required permission: '${permission}'.`);
            }

            await func(req, res, next);
        };
    }
}

export default requiredPermissionWrapper;
