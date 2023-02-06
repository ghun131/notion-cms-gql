export interface Config {
  cors: CorsConfig;
  graphql: GraphqlConfig;
  server?: ServerConfig;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface ServerConfig {
  port: number;
}
