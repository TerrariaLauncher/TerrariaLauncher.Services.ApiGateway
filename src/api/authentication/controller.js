
import gRpcClients from '../../grpc/grpc-clients.js';
import HttpErrors from '../commons/http-errors/index.js';
import util from 'util';
import gRpc from '@grpc/grpc-js';
import { GrpcError } from '../commons/grpc/index.js';

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function login(req, res) {
    const { name, email, password } = req.body;
    let loginResponse = null;
    try {
        loginResponse = await util.promisify(gRpcClients.services.authentication.login)
            .call(gRpcClients.services.authentication, {
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
        user = await util.promisify(gRpcClients.services.authentication.getUserByName)
            .call(gRpcClients.services.authentication, { name });
    } catch (error) {
        if (error.code !== gRpc.status.NOT_FOUND) throw new GrpcError(error);
    }
    if (user) throw new HttpErrors.Conflict('User name is existed.');

    if (email) {
        try {
            user = await util.promisify(gRpcClients.services.authentication.GetUserByEmail)
                .call(gRpcClients.services.authentication, { email });
        } catch (error) {
            if (error.code !== gRpc.status.NOT_FOUND) throw new GrpcError(error);
        }
        if (user) throw new HttpErrors.Conflict('Email is existed.');
    }

    try {
        const registerResponse = await util.promisify(gRpcClients.services.authentication.register)
            .call(gRpcClients.services.authentication, {
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
        ({ accessToken } = await util.promisify(gRpcClients.services.authentication.renewAccessToken)
            .call(gRpcClients.services.authentication, {
                refreshToken: refreshToken
            })
        );
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
