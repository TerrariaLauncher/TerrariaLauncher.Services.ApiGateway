import gRpcClients from '../../grpc/grpc-clients.js';
import pbMessages from '../../grpc/messages.js';
import HttpErrors from '../commons/http-errors/index.js';
import util from 'util';
import gRpc from '@grpc/grpc-js';
import { GrpcError } from '../commons/grpc/index.js';

const authenticationService = {
    login: util.promisify(gRpcClients.services.authentication.authentication.login)
        .bind(gRpcClients.services.authentication.authentication),
    getUser: util.promisify(gRpcClients.services.authentication.authentication.getUser)
        .bind(gRpcClients.services.authentication.authentication),
    register: util.promisify(gRpcClients.services.authentication.authentication.register)
        .bind(gRpcClients.services.authentication.authentication),
    renewAccessToken: util.promisify(gRpcClients.services.authentication.authentication.renewAccessToken)
        .bind(gRpcClients.services.authentication.authentication)
};

const cookies = {
    authentication: {
        name: 'TerrariaLauncher.Authentication',
        options: {
            httpOnly: true,
            path: '/api',
            maxAge: (7 * 24 * 60 * 60) * 1000
        }
    },
    refreshToken: {
        name: 'TerrariaLauncher.RefreshToken',
        options: {
            httpOnly: true,
            path: '/api/authentication/token',
            maxAge: (7 * 24 * 60 * 60) * 1000
        }
    }
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function login(req, res) {
    const { name, email, password } = req.body;
    let loginResponse = null;
    try {
        const loginRequest = new pbMessages.service.authentication.LoginRequest();
        if (email) loginRequest.setEmail(email);
        if (name) loginRequest.setName(name);
        loginRequest.setPassword(password);
        loginResponse = await authenticationService.login(loginRequest);
    } catch (error) {
        throw new GrpcError(error);
    }

    res
        .cookie(cookies.authentication.name, `Bearer ${loginResponse.getAccessToken()}`, cookies.authentication.options)
        .cookie(cookies.refreshToken.name, loginResponse.getRefreshToken(), cookies.refreshToken.options)
        .json({
            id: loginResponse.getId(),
            name: loginResponse.getName(),
            group: loginResponse.getGroup(),
            accessToken: loginResponse.getAccessToken(),
            refreshToken: loginResponse.getRefreshToken()
        });
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function register(req, res) {
    const { name, password, email } = req.body;

    let getUserResponse = null;
    try {
        const getUserRequest = new pbMessages.service.authentication.GetUserRequest();
        if (name) {
            getUserRequest.setName(name);
        } else if (email) {
            getUserRequest.setEmail(email);
        } else {
            throw new HttpErrors.BadRequest();
        }
        getUserResponse = await authenticationService.getUser(getUserRequest);
    } catch (error) {
        if (error.code !== gRpc.status.NOT_FOUND) throw new GrpcError(error);
    }

    if (getUserResponse) throw new HttpErrors.Conflict('User name is existed.');

    try {
        const registerRequest = new pbMessages.service.authentication.RegisterRequest();
        registerRequest.setName(name);
        registerRequest.setPassword(password);
        registerRequest.setEmail(email);
        const registerResponse = await authenticationService.register(registerRequest);

        res.status(200).json({
            id: registerResponse.getId(),
            name: registerResponse.getName(),
            group: registerResponse.getGroup(),
            email: registerResponse.getEmail()
        });
    } catch (error) {
        throw new GrpcError(error);
    }
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function renewToken(req, res) {
    const refreshToken = req.cookies['TerrariaLauncher.RefreshToken'];
    if (!refreshToken) throw new HttpErrors.BadRequest('Refresh token is invalid');

    let id;
    let name;
    let group;
    let accessToken;
    try {
        const renewAccessTokenRequest = new pbMessages.service.authentication.RenewAccessTokenTokenRequest();
        renewAccessTokenRequest.setRefreshToken(refreshToken);
        const renewAccessTokenResponse = await authenticationService.renewAccessToken(renewAccessTokenRequest)
        accessToken = renewAccessTokenResponse.getAccessToken();
        id = renewAccessTokenResponse.getId();
        name = renewAccessTokenResponse.getName();
        group = renewAccessTokenResponse.getGroup()
    } catch (error) {
        if (error.code === gRpc.status.INVALID_ARGUMENT) throw new HttpErrors.BadRequest('Refresh token is invalid');
        else throw new GrpcError(error);
    }

    res
        .cookie(cookies.authentication.name, `Bearer ${accessToken}`, cookies.authentication.options)
        .cookie(cookies.refreshToken.name, refreshToken, cookies.refreshToken.options)
        .json({
            id,
            name,
            group,
            accessToken
        });
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export function logout(req, res) {
    res.clearCookie(cookies.authentication.name, Object.assign({}, cookies.authentication.options, {
        maxAge: 0
    })).clearCookie(cookies.refreshToken.name, Object.assign({}, cookies.refreshToken.options, {
        maxAge: 0
    })).json({
        message: 'See you again!'
    });
}
