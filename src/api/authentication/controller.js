
import gRpcClients from '../../grpc/grpc-clients.js';
import HttpErrors from '../commons/http-errors/index.js';
import util from 'util';
import gRpc from '@grpc/grpc-js';
import { GrpcError } from '../commons/grpc/index.js';

const authenticationService = {
    login: util.promisify(gRpcClients.services.authentication.authentication.login)
        .bind(gRpcClients.services.authentication.authentication),
    getUserByName: util.promisify(gRpcClients.services.authentication.authentication.getUserByName)
        .bind(gRpcClients.services.authentication.authentication),
    getUserByEmail: util.promisify(gRpcClients.services.authentication.authentication.getUserByEmail)
        .bind(gRpcClients.services.authentication.authentication),
    register: util.promisify(gRpcClients.services.authentication.authentication.register)
        .bind(gRpcClients.services.authentication.authentication),
    renewAccessToken: util.promisify(gRpcClients.services.authentication.authentication.renewAccessToken)
        .bind(gRpcClients.services.authentication.authentication)
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function login(req, res) {
    const { name, email, password } = req.body;
    let loginResponse = null;
    try {
        loginResponse = await authenticationService.login({
            name,
            email,
            password
        });
    } catch (error) {
        throw new GrpcError(error);
    }

    res.cookie('TerrariaLauncher.Authentication', `Bearer ${loginResponse.accessToken}`, {
        httpOnly: true,
        maxAge: (7 * 24 * 60 * 60) * 1000
    }).cookie('TerrariaLauncher.RefreshToken', loginResponse.refreshToken, {
        httpOnly: true,
        path: '/authentication/token',
        maxAge: (7 * 24 * 60 * 60) * 1000
    });

    res.status(200).json(loginResponse);
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function register(req, res) {
    const { name, password, email } = req.body;

    let user = null;
    try {
        user = await authenticationService.getUserByName({ name });
    } catch (error) {
        if (error.code !== gRpc.status.NOT_FOUND) throw new GrpcError(error);
    }
    if (user) throw new HttpErrors.Conflict('User name is existed.');

    if (email) {
        try {
            user = await authenticationService.getUserByEmail({ email });
        } catch (error) {
            if (error.code !== gRpc.status.NOT_FOUND) throw new GrpcError(error);
        }
        if (user) throw new HttpErrors.Conflict('Email is existed.');
    }

    try {
        const registerResponse = await authenticationService.register({
            name,
            password,
            email
        });

        res.status(200).json({
            id: registerResponse.id,
            name: registerResponse.name,
            group: registerResponse.group,
            email: registerResponse.email
        });
    } catch (exception) {
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
    let accessToken;
    try {
        ({ accessToken } = await authenticationService.renewAccessToken({
            refreshToken: refreshToken
        }));
    } catch (error) {
        if (error.code === gRpc.status.INVALID_ARGUMENT) throw new HttpErrors.BadRequest('Refresh token is invalid');
        else throw new GrpcError(error);
    }

    res.cookie('TerrariaLauncher.Authentication', `Bearer ${accessToken}`, {
        httpOnly: true,
        maxAge: (7 * 24 * 60 * 60) * 1000
    }).cookie('TerrariaLauncher.RefreshToken', refreshToken, {
        httpOnly: true,
        path: '/authentication/token',
        maxAge: (7 * 24 * 60 * 60) * 1000
    });

    res.status(200).json({
        message: 'Success!'
    });
}
