import grpcClients from '../../grpc/grpc-clients.js';
import pbMessages from '../../grpc/messages.js';
import util from 'util';

const tShockInstanceManagement = {
    getInstances: util.promisify(grpcClients.services.tShockGateway.tShockInstanceManagement.getInstances)
        .bind(grpcClients.services.tShockGateway.tShockInstanceManagement)
};

export async function getServerInstances(req, res) {
    const getInstancesRequest = new pbMessages.service.tShockGateway.GetInstancesRequest();
    const getInstancesResponse = await tShockInstanceManagement.getInstances(getInstancesRequest);
    const instances = [];
    for (const instance of getInstancesResponse.getInstancesList()) {
        instances.push({
            id: instance.getId(),
            name: instance.getName(),
            publicHost: instance.getPublicHost(),
            publicPort: instance.getPublicPort()
        });
    }
    res.status(200).json({
        servers: instances
    });
}
