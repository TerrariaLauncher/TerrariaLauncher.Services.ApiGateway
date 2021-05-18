import authentication from './generated-code/services/authentication/authentication_pb.cjs';
import authorization from './generated-code/services/authentication/authorization_pb.cjs';

import instanceManagement from './generated-code/services/instance_gateway/instance_management_pb.cjs';
import instancePlayerManagement from './generated-code/services/instance_gateway/instance_player_management_pb.cjs';
import instanceUserManagement from './generated-code/services/instance_gateway/instance_user_management_pb.cjs';
import instanceGroupManagement from './generated-code/services/instance_gateway/instance_group_management_pb.cjs';

import instancePlugins_instanceManagement_instancePlayerManagement from './generated-code/instance_plugins/instance_management/instance_player_management_pb.cjs';
import instancePlugins_instanceManagement_instanceUserManagement from './generated-code/instance_plugins/instance_management/instance_user_management_pb.cjs';
import instancePlugins_instanceManagement_instanceGroupManagement from './generated-code/instance_plugins/instance_management/instance_group_management_pb.cjs';

import registeredInstanceUserService from './generated-code/services/trading_system/registered_instance_user_service_pb.cjs';
import levelService from './generated-code/services/trading_system/level_service_pb.cjs';
import shopService from './generated-code/services/trading_system/shop_service_pb.cjs';

export default {
    service: {
        authentication: {
            ...authentication,
            ...authorization
        },
        instanceGateway: {
            ...instanceManagement,
            ...instancePlayerManagement,
            ...instanceUserManagement,
            ...instanceGroupManagement
        },
        tradingSystem: {
            ...registeredInstanceUserService,
            ...levelService,
            ...shopService
        }
    },
    instancePlugins: {
        instanceManagement: {
            ...instancePlugins_instanceManagement_instancePlayerManagement,
            ...instancePlugins_instanceManagement_instanceUserManagement,
            ...instancePlugins_instanceManagement_instanceGroupManagement
        }
    }
}
