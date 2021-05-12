import gRpcLibrary from '@grpc/grpc-js';
import gRpcObject from './grpc-object.js';
import configs from '../configs/index.js';

import { AuthenticationClient } from './generated-code/services/authentication/authentication_grpc_pb.cjs';
import { AuthorizationClient } from './generated-code/services/authentication/authorization_grpc_pb.cjs';
import { TShockInstanceManagementClient } from './generated-code/services/tshock_gateway/tshock_instance_management_grpc_pb.cjs';
import { TShockPlayerManagementClient } from './generated-code/services/tshock_gateway/tshock_player_management_grpc_pb.cjs';
import { TShockUserManagementClient } from './generated-code/services/tshock_gateway/tshock_user_management_grpc_pb.cjs';
import { TShockGroupManagementClient } from './generated-code/services/tshock_gateway/tshock_group_management_grpc_pb.cjs';

export default {
    services: {
        authentication: {
            authentication: new AuthenticationClient(
                `${configs.get('gRpc.services.authentication.host')}:${configs.get('gRpc.services.authentication.port')}`,
                gRpcLibrary.credentials.createInsecure()
            ),
            authorization: new AuthorizationClient(
                `${configs.get('gRpc.services.authentication.host')}:${configs.get('gRpc.services.authentication.port')}`,
                gRpcLibrary.credentials.createInsecure()
            )
        },
        tShockGateway: {
            tShockInstanceManagement: new TShockInstanceManagementClient(
                `${configs.get('gRpc.services.tShockGateway.host')}:${configs.get('gRpc.services.tShockGateway.port')}`,
                gRpcLibrary.credentials.createInsecure()
            ),
            tShockPlayerManagement: new TShockPlayerManagementClient(
                `${configs.get('gRpc.services.tShockGateway.host')}:${configs.get('gRpc.services.tShockGateway.port')}`,
                gRpcLibrary.credentials.createInsecure()
            ),
            tShockUserManagement: new TShockUserManagementClient(
                `${configs.get('gRpc.services.tShockGateway.host')}:${configs.get('gRpc.services.tShockGateway.port')}`,
                gRpcLibrary.credentials.createInsecure()
            ),
            tShockGroupManagement: new TShockGroupManagementClient(
                `${configs.get('gRpc.services.tShockGateway.host')}:${configs.get('gRpc.services.tShockGateway.port')}`,
                gRpcLibrary.credentials.createInsecure()
            )
        }
    }
}
