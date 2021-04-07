import logger from '../../../../logger/index.js';
import { GrpcError } from '../../grpc/index.js';
import { HttpError } from '../../http-errors/index.js';
import gRpc from '@grpc/grpc-js';

const critialErrorMessage = {
    error: '🛑 Oops!!!'
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export const errorHandler = function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof HttpError) {
        res.status(err.code);
        if (err.meta === undefined || err.message === null) {
            res.send(err.name);
        }
        else if (typeof (err.meta) === 'string') {
            res.json({
                error: {
                    message: err.meta
                }
            });
        } else {
            res.json({
                error: err.meta
            });
        }
    }
    else if (err instanceof GrpcError) {
        switch (err.code || gRpc.status.UNKNOWN) {
            case gRpc.status.ALREADY_EXISTS:
                res.status(409).json({
                    error: err.details
                });
                break;
            case gRpc.status.INVALID_ARGUMENT:
                res.status(400).json({
                    error: err.details
                });
                break;
            default:
                res.status(500).json(critialErrorMessage);
        }
    }
    else {
        res.status(500).json(critialErrorMessage);
    }

    console.log(err);
};

export default errorHandler;
