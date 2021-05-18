import gRpcLibrary from '@grpc/grpc-js';
import gRpcObject from './grpc-object.js';
import configs from '../configs/index.js';

import { AuthenticationClient } from './generated-code/services/authentication/authentication_grpc_pb.cjs';
import { AuthorizationClient } from './generated-code/services/authentication/authorization_grpc_pb.cjs';

import { InstanceManagementClient } from './generated-code/services/instance_gateway/instance_management_grpc_pb.cjs';
import { InstancePlayerManagementClient } from './generated-code/services/instance_gateway/instance_player_management_grpc_pb.cjs';
import { InstanceUserManagementClient } from './generated-code/services/instance_gateway/instance_user_management_grpc_pb.cjs';
import { InstanceGroupManagementClient } from './generated-code/services/instance_gateway/instance_group_management_grpc_pb.cjs';

import { RegisteredInstanceUserServiceClient } from './generated-code/services/trading_system/registered_instance_user_service_grpc_pb.cjs'

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
        instanceGateway: {
            instanceManagement: new InstanceManagementClient(
                `${configs.get('gRpc.services.instanceGateway.host')}:${configs.get('gRpc.services.instanceGateway.port')}`,
                gRpcLibrary.credentials.createInsecure()
            ),
            instancePlayerManagement: new InstancePlayerManagementClient(
                `${configs.get('gRpc.services.instanceGateway.host')}:${configs.get('gRpc.services.instanceGateway.port')}`,
                gRpcLibrary.credentials.createInsecure()
            ),
            instanceUserManagement: new InstanceUserManagementClient(
                `${configs.get('gRpc.services.instanceGateway.host')}:${configs.get('gRpc.services.instanceGateway.port')}`,
                gRpcLibrary.credentials.createInsecure()
            ),
            instanceGroupManagement: new InstanceGroupManagementClient(
                `${configs.get('gRpc.services.instanceGateway.host')}:${configs.get('gRpc.services.instanceGateway.port')}`,
                gRpcLibrary.credentials.createInsecure()
            )
        },
        tradingSystem: {
            registeredInstanceUserService: new RegisteredInstanceUserServiceClient(
                `${configs.get('gRpc.services.tradingSystem.host')}:${configs.get('gRpc.services.tradingSystem.port')}`,
                gRpcLibrary.credentials.createInsecure()
            )
        }
    }
}
