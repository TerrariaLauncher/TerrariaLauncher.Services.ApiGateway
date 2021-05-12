import authentication from './generated-code/services/authentication/authentication_pb.cjs';
import authorization from './generated-code/services/authentication/authorization_pb.cjs';

import tShockInstanceManagement from './generated-code/services/tshock_gateway/tshock_instance_management_pb.cjs';
import tShockPlayerManagement from './generated-code/services/tshock_gateway/tshock_player_management_pb.cjs';
import tShockUserManagement from './generated-code/services/tshock_gateway/tshock_user_management_pb.cjs';
import tShockGroupManagement from './generated-code/services/tshock_gateway/tshock_group_management_pb.cjs';

import tShockPlugins_tShockManagement_tShockPlayerManagement from './generated-code/tshock_plugins/tshock_management/tshock_player_management_pb.cjs';
import tShockPlugins_tShockManagement_tShockUserManagement from './generated-code/tshock_plugins/tshock_management/tshock_user_management_pb.cjs';
import tShockPlugins_tShockManagement_tShockGroupManagement from './generated-code/tshock_plugins/tshock_management/tshock_group_management_pb.cjs';

export default {
    service: {
        authentication: {
            ...authentication,
            ...authorization
        },
        tShockGateway: {
            ...tShockInstanceManagement,
            ...tShockPlayerManagement,
            ...tShockUserManagement,
            ...tShockGroupManagement
        }
    },
    tShockPlugins: {
        tShockManagement: {
            ...tShockPlugins_tShockManagement_tShockPlayerManagement,
            ...tShockPlugins_tShockManagement_tShockUserManagement,
            ...tShockPlugins_tShockManagement_tShockGroupManagement
        }
    }
}
