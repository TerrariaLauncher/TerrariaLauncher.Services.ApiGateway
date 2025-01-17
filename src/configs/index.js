import dotenv from 'dotenv';
import convict from 'convict';

dotenv.config();
export const configs = convict({
    env: {
        default: 'development',
        format: ['production', 'development', 'test'],
        env: 'NODE_ENV'
    },
    port: {
        default: 3000,
        format: 'port',
        env: 'PORT'
    },
    jwtSecret: {
        default: 'shhhhh'
    },
    allowOrigins: {
         default: []
    },
    gRpc: {
        services: {
            authentication: {
                host: {
                    default: "localhost"
                },
                port: {
                    default: 3101
                }
            },
            instanceGateway: {
                host: {
                    default: "localhost"
                },
                port: {
                    default: 3102
                }
            },
            tradingSystem: {
                host: {
                    default: "localhost"
                },
                port: {
                    default: 3103
                }
            }
        }
    }
});

const env = configs.get('env');
configs.loadFile(`./configs.${env}.json`);
configs.validate({ allowed: 'strict' });

export default configs;
