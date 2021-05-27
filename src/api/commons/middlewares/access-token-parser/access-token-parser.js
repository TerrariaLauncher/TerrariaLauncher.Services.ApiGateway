import HttpErrors from '../../http-errors/index.js';
import gRpcClients from '../../../../grpc/grpc-clients.js';
import protoMessages from '../../../../grpc/messages.js';
import gRpc from '@grpc/grpc-js';
import util from 'util';

const parseAccessToken = util.promisify(gRpcClients.services.authentication.authentication.parseAccessToken)
    .bind(gRpcClients.services.authentication.authentication);

export async function accessTokenParser(req, res, next) {
    const authenticationHeader = req.cookies['TerrariaLauncher.Authentication'];
    if (!authenticationHeader) {
        throw new HttpErrors.Unauthorized('Authentication is required.');
    }

    const [schema, token] = authenticationHeader.split(' ');
    if (schema !== 'Bearer') throw new HttpErrors.Unauthorized('Authentication schema is invalid.');
    try {
        var parseAccessTokenRequest = new protoMessages.service.authentication.ParseAccessTokenRequest();
        parseAccessTokenRequest.setAccessToken(token);
        const parseAccessTokenResponse = await parseAccessToken(parseAccessTokenRequest);
        req.auth = {
            user: {
                id: parseAccessTokenResponse.getId(),
                name: parseAccessTokenResponse.getName(),
                group: parseAccessTokenResponse.getGroup()
            }
        };
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
