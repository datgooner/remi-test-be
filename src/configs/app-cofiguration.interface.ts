import {
  AppConfig,
  DatabaseConfig,
  NetworkConfig,
  SecurityConfig,
} from '@/interfaces/configuration.interface';

export default interface Configuration {
  app: AppConfig;
  database: DatabaseConfig;
  security: SecurityConfig;
  network: NetworkConfig;
}
