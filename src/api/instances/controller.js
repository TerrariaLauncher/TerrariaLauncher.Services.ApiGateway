import grpcClients from '../../grpc/grpc-clients.js';
import pbMessages from '../../grpc/messages.js';
import util from 'util';

const instanceManagement = {
    getInstances: util.promisify(grpcClients.services.instanceGateway.instanceManagement.getInstances)
        .bind(grpcClients.services.instanceGateway.instanceManagement)
};

export async function getInstances(req, res) {
    const getInstancesRequest = new pbMessages.service.instanceGateway.GetInstancesRequest();
    const getInstancesResponse = await instanceManagement.getInstances(getInstancesRequest);
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
        instances: instances
    });
}
