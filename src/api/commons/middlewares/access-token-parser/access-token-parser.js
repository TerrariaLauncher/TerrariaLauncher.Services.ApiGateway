import jwt from 'jsonwebtoken';
import HttpErrors from '../../http-errors/index.js';
import configs from '../../../../configs/index.js';
import gRpcClients from '../../../../grpc/grpc-clients.js';
import gRpc from '@grpc/grpc-js';
import util from 'util';

const JWT_SECRET = configs.get('jwtSecret');

export const accessTokenParser = async function (req, res, next) {
    const authenticationHeader = req.cookies['TerrariaLauncher.Authentication'];
    if (!authenticationHeader) {
        throw new HttpErrors.Unauthorized('Authentication is required.');
    }

    const [schema, token] = authenticationHeader.split(' ');
    if (schema !== 'Bearer') throw new HttpErrors.Unauthorized('Authentication schema is invalid.');
    try {
        const decoded = await util.promisify(gRpcClients.services.authentication.parseAccessToken)({
            accessToken: token
        });
        req.auth = decoded;
    } catch (err) {
        if (err.code === gRpc.status.INVALID_ARGUMENT) {
            throw new HttpErrors.Unauthorized('Authentication is expired.');
        } else {
            throw new HttpErrors.InternalServerError('🛑 Oops! Could not verify authentication.');
        }
    }

    next();
};

export default accessTokenParser;
