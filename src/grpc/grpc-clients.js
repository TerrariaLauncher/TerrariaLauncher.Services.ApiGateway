import gRpcLibrary from '@grpc/grpc-js';
import gRpcObject from './grpc-object.js';
import configs from '../configs/index.js';

export default {
    services: {
        authentication: new gRpcObject.terraria_launcher.protos.services.authentication.Authentication(
            `${configs.get('gRpc.services.authentication.host')}:${configs.get('gRpc.services.authentication.port')}`,
            gRpcLibrary.credentials.createInsecure()
        )
    },
    tShockPlugins: {
        tShockManagement: {
            tShockAccountManagement: new gRpcObject.terraria_launcher.protos.tshock_plugins.tshock_management.TShockAccountManagement(
                `${configs.get('gRpc.tShockPlugins.tShockManagement.host')}:${configs.get('gRpc.tShockPlugins.tShockManagement.port')}`,
                gRpcLibrary.credentials.createInsecure()
            ),
            tShockPlayerManagement: new gRpcObject.terraria_launcher.protos.tshock_plugins.tshock_management.TShockPlayerManagement(
                `${configs.get('gRpc.tShockPlugins.tShockManagement.host')}:${configs.get('gRpc.tShockPlugins.tShockManagement.port')}`,
                gRpcLibrary.credentials.createInsecure()
            )
        }
    }
}
