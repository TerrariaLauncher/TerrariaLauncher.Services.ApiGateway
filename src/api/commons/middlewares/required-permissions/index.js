import gRpcClients from '../../../../grpc/grpc-clients.js';
import util from 'util';
import HttpErrors from '../../http-errors/http-errors.js';

const doesGroupContainsPermission = util.promisify(gRpcClients.services.authentication.authorization.doesGroupContainsPermission)
    .bind(gRpcClients.services.authentication.authorization);

export function requiredPermission(permission) {
    return async function (req, res, next) {
        const group = req.auth?.group ?? 'guest';
        const { contains } = await doesGroupContainsPermission({
            group,
            permission
        });

        if (!contains) {
            throw new HttpErrors.Forbidden(`Required permission: '${permission}'.`);
        }

        next();
    };
}

export default requiredPermission;
