import logger from '../../../../logger/index.js';
import { GrpcError } from '../../grpc/index.js';
import { HttpError } from '../../http-errors/index.js';
import gRpc from '@grpc/grpc-js';
import commonPbMessages from '../../../../grpc/generated-code/common_messages_pb.cjs';

const grpcRegex = /@grpc\\grpc-js/;
function isGrpcError(error) {
    return grpcRegex.test(error.stack);
}

function getInvalidArguments(grpcError) {
    const raw = grpcError.metadata.get('invalid-arguments-bin')?.[0]
    if (raw) {
        return commonPbMessages.InvalidArguments.deserializeBinary(raw).toObject().entriesList;
    } else {
        return [];
    }
}
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
    else if (err instanceof GrpcError || isGrpcError(err)) {
        switch (err.code || gRpc.status.UNKNOWN) {
            case gRpc.status.OUT_OF_RANGE:
            case gRpc.status.INVALID_ARGUMENT:
                res.status(400).json({
                    error: {
                        message: err.details,
                        details: getInvalidArguments(err)
                    }
                });
                break;
            case gRpc.status.ALREADY_EXISTS:
                res.status(409).json({
                    error: {
                        message: err.details,
                        details: getInvalidArguments(err)
                    }
                });
                break;
            case gRpc.status.NOT_FOUND:
                res.status(404).json({
                    error: {
                        message: err.details
                    }
                });
                break;
            case gRpc.status.UNAVAILABLE:
                res.status(503).json({
                    error: {
                        message: err.details
                    }
                });
                break;
            default:
                res.status(500).json({
                    error: {
                        message: '🛑 Oops!!!'
                    }
                });
        }
    }
    else {
        res.status(500).json({
            error: {
                message: '🛑 Oops!!!'
            }
        });
    }

    console.log(err);
};

export default errorHandler;
