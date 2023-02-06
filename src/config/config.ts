import { Config } from './config.interface';

const config: Config = {
  cors: {
    enabled: true,
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.gql',
    sortSchema: true,
  },
};

export default (): Config => config;
