import gRpcClients from '../../grpc/grpc-clients.js';

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function getPlayers(req, res) {
    const players = await gRpcClients.tShockPlugins.tShockManagement.tShockPlayerManagement.getPlayers();

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
    const { index } = req.params;
    const player = await gRpcClients.tShockPlugins.tShockManagement.tShockPlayerManagement.getPlayer(index);
    res.status(200).json({
        player: player
    });
}
