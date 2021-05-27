import gRpcClients from '../../../../grpc/grpc-clients.js';
import protoMessages from '../../../../grpc/messages.js';
import util from 'util';
import HttpErrors from '../../http-errors/http-errors.js';

const isGroupAllowed = util.promisify(gRpcClients.services.authentication.authorization.isGroupAllowed)
    .bind(gRpcClients.services.authentication.authorization);

export function requiredGroup(requiredGroup) {
    return async function (req, res, next) {
        const group = req.auth?.user?.group ?? 'guest';

        const requestMessage = new protoMessages.service.authentication.IsGroupAllowedRequest();
        requestMessage.setGroup(group);
        requestMessage.setRequiredGroup(requiredGroup);
        const responseMessage = await isGroupAllowed(requestMessage);

        if (!responseMessage.getIsAllowed()) {
            throw new HttpErrors.Forbidden(`Required group: '${requiredGroup}'.`);
        }

        next();
    };
}

export default requiredGroup;
