import grpc from '@grpc/grpc-js';
import grpcClients from '../../../grpc/grpc-clients.js';
import pbMessages from '../../../grpc/messages.js';
import util from 'util';
import asyncWrapper from '../../commons/async-wrapper/async-wrapper.js';
import HttpErrors from '../../commons/http-errors/index.js';
import requiredPermissionWrapper from '../../commons/required-permission-wrapper/index.js';
import { GrpcError } from '../../commons/grpc/index.js';

const tShockPlayerManagement = {
    getPlayers: util.promisify(grpcClients.services.tShockGateway.tShockPlayerManagement.getPlayers)
        .bind(grpcClients.services.tShockGateway.tShockPlayerManagement)
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function getPlayers(req, res, next) {
    const { level } = req.query;
    switch (level) {
        case 'real-time':
            await requiredPermissionWrapper('*')(trackPlayerSession)(req, res, next);
            break;
        default:
            await requiredPermissionWrapper('*')(getAllPlayers)(req, res, next);
    }
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function trackPlayerSession(req, res, next) {
    res.set('Cache-Control', 'no-cache');
    res.set('Content-Type', 'text/event-stream');

    const { serverIndex } = req.params;
    const trackPlayerSessionRequest = new pbMessages.service.tShockGateway.TrackPlayerSessionRequest();
    const payload = new pbMessages.service.tShockGateway.TrackPlayerSessionRequest.Payload();
    payload.setNeedInitialization(true);
    trackPlayerSessionRequest.setInstance(serverIndex);
    trackPlayerSessionRequest.setPayload(payload);
    const TrackPlayerSessionResponse = pbMessages.tShockPlugins.tShockManagement.TrackPlayerSessionResponse;

    const call = grpcClients.services.tShockGateway.tShockPlayerManagement.trackPlayerSession(trackPlayerSessionRequest);
    req.on('close', function () {
        call.cancel();
    });
    await new Promise(function (resolve, reject) {
        call.on('data', function (trackPlayerSessionResponse) {
            switch (trackPlayerSessionResponse.getEventType()) {
                case TrackPlayerSessionResponse.EventType.INITIAL:
                    res.write('event: initial\n');
                    break;
                case TrackPlayerSessionResponse.EventType.JOIN:
                    res.write('event: join\n');
                    break;
                case TrackPlayerSessionResponse.EventType.LEAVE:
                    res.write('event: leave\n');
                    break;
                case TrackPlayerSessionResponse.EventType.LOGIN:
                    res.write('event: login\n');
                    break;
                case TrackPlayerSessionResponse.EventType.LOGOUT:
                    res.write('event: logout\n');
                    break;
                default:
                    res.write('event: unknown\n');
                    break;
            }
            const data = {
                player: {
                    id: trackPlayerSessionResponse.getPlayer().getId(),
                    name: trackPlayerSessionResponse.getPlayer().getName()
                },
                user: {
                    id: trackPlayerSessionResponse.getUser().getId(),
                    name: trackPlayerSessionResponse.getUser().getName()
                },
                group: {
                    name: trackPlayerSessionResponse.getGroup().getName()
                },
                timeStamp: {
                    seconds: trackPlayerSessionResponse.getTimestamp().getSeconds(),
                    nanos: trackPlayerSessionResponse.getTimestamp().getNanos()
                }
            };
            res.write(`data: ${JSON.stringify(data)}`);
            res.write('\n\n');
        });
        call.on('error', function (error) {
            reject(new GrpcError(error));
        });
        call.on('end', function () {
            resolve();
        });
    });

    res.end();
}

async function getAllPlayers(req, res) {
    const { serverIndex } = req.params;

    const getPlayersRequest = new pbMessages.service.tShockGateway.GetPlayersRequest();
    const payload = new pbMessages.tShockPlugins.tShockManagement.GetPlayersRequest();
    getPlayersRequest.setInstance(serverIndex);
    getPlayersRequest.setPayload(payload);

    const getPlayersResponse = await tShockPlayerManagement.getPlayers(getPlayersRequest);
    const players = [];
    for (const playerMessage of getPlayersResponse.getPlayersList()) {
        players.push({
            id: playerMessage.getId(),
            name: playerMessage.getName(),
            user: {
                id: playerMessage.getUser().getId(),
                name: playerMessage.getUser().getName()
            },
            group: {
                name: playerMessage.getGroup().getName()
            }
        });
    }

    res.status(200).json({
        players: players
    });
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function getPlayer(req, res) {
    const { level } = req.query;
    switch (level) {
        case 'real-time':
            await requiredPermissionWrapper('*')(trackPlayerData)(req, res);
            break;
        case 'verbose':
            await requiredPermissionWrapper('*')(getPlayerData)(req, res);
            break;
        default:
            await requiredPermissionWrapper('*')(getPlayerInfo)(req, res);
            break;
    }
}

async function getPlayerInfo(req, res) {
    throw new HttpErrors.MethodNotAllowed();
}

async function getPlayerData(req, res) {
    throw new HttpErrors.MethodNotAllowed();
}

async function trackPlayerData(req, res) {
    res.set('Cache-Control', 'no-cache');
    res.set('Content-Type', 'text/event-stream');

    const { serverIndex, playerName } = req.params;

    const trackPlayerDataRequest = new pbMessages.service.tShockGateway.TrackPlayerDataRequest();
    const trackPlayerDataRequest_Payload = new pbMessages.service.tShockGateway.TrackPlayerDataRequest.Payload();
    trackPlayerDataRequest_Payload.setPlayerName(playerName);
    trackPlayerDataRequest_Payload.setNeedInitialization(true);
    trackPlayerDataRequest.setInstance(serverIndex);
    trackPlayerDataRequest.setPayload(trackPlayerDataRequest_Payload);

    const call = grpcClients.services.tShockGateway.tShockPlayerManagement.trackPlayerData(trackPlayerDataRequest);
    req.on('close', function () {
        call.cancel();
    });

    await new Promise(function (resolve, reject) {
        let errorIndication = false;
        call.on('data', function (trackPlayerDataResponse) {
            const detailsMessage = trackPlayerDataResponse.getDetails();
            let details = null;
            switch (detailsMessage.getTypeName()) {
                case 'terraria_launcher.protos.tshock_plugins.tshock_management.TrackPlayerDataResponse.SlotEventDetails':
                    details = detailsMessage.unpack(
                        pbMessages.tShockPlugins.tShockManagement.TrackPlayerDataResponse.SlotEventDetails.deserializeBinary,
                        'terraria_launcher.protos.tshock_plugins.tshock_management.TrackPlayerDataResponse.SlotEventDetails');
                    res.write('event: slot\n');
                    break;
                case 'terraria_launcher.protos.tshock_plugins.tshock_management.TrackPlayerDataResponse.HealthEventDetails':
                    details = detailsMessage.unpack(
                        pbMessages.tShockPlugins.tShockManagement.TrackPlayerDataResponse.HealthEventDetails.deserializeBinary,
                        'terraria_launcher.protos.tshock_plugins.tshock_management.TrackPlayerDataResponse.HealthEventDetails');
                    res.write('event: health\n');
                    break;
                case 'terraria_launcher.protos.tshock_plugins.tshock_management.TrackPlayerDataResponse.ManaEventDetails':
                    details = detailsMessage.unpack(
                        pbMessages.tShockPlugins.tShockManagement.TrackPlayerDataResponse.ManaEventDetails.deserializeBinary,
                        'terraria_launcher.protos.tshock_plugins.tshock_management.TrackPlayerDataResponse.ManaEventDetails');
                    res.write('event: mana\n');
                    break;
                case 'terraria_launcher.protos.tshock_plugins.tshock_management.TrackPlayerDataResponse.BuffEventDetails':
                    details = detailsMessage.unpack(
                        pbMessages.tShockPlugins.tShockManagement.TrackPlayerDataResponse.BuffEventDetails.deserializeBinary,
                        'terraria_launcher.protos.tshock_plugins.tshock_management.TrackPlayerDataResponse.BuffEventDetails');
                    res.write('event: buff\n');
                    break;
                default:
                    return;
            }

            const data = {
                player: trackPlayerDataResponse.getPlayer().toObject(),
                details: details.toObject(),
                timestamp: trackPlayerDataResponse.getTimestamp().toObject(),
                isInitial: trackPlayerDataResponse.getIsInitial()
            };
            res.write(`data: ${JSON.stringify(data)}`);
            res.write('\n\n');
        });
        call.on('error', function (error) {
            // Only 'error' or 'end' will be emitted, but the current state of grpc-js is call both!?
            // This variable will be obsoleted when the problem is fixed.
            errorIndication = true;
            reject(new GrpcError(error));
        });
        call.on('end', function () {
            if (!errorIndication) {
                res.write('event: finish\n');
                res.write('data: ');
                res.write('\n\n')
            }
            resolve();
        });
    });

    res.end();
}
