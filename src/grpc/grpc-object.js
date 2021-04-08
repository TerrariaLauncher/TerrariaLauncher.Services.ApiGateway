import protoLoader from '@grpc/proto-loader';
import gRpc from '@grpc/grpc-js';
import protos from 'terraria-launcher.protos';

const gRpcDefinitions = protoLoader.loadSync([
    protos.services.authentication['authentication.proto'],
    protos.services.authentication['authorization.proto'],
    protos.tShockPlugins.tShockManagement['tshock_account_management.proto'],
    protos.tShockPlugins.tShockManagement['tshock_player_management.proto']
], {
    includeDirs: [protos.root],
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const gRpcObject = gRpc.loadPackageDefinition(gRpcDefinitions);
export default gRpcObject;
