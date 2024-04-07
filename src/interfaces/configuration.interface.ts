import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export interface AppConfig {
  name: string;
  method: string;
  host: string;
  port: number;
  cors: CorsOptions;
}

export interface DatabaseConfig {
  mongo: { dbname: string; user: string; password: string; uri: string };
}

/**
 * Contains security-related configurations.
 */
export interface SecurityConfig {
  /**
   * Contains JSON Web Token configurations.
   */
  jwt: {
    /**
     * Secret key for signing.
     */
    secret: string;
    /**
     * Duration (in milliseconds) after that a new-signed token would be expired.
     */
    tokenExpiry: number;
  };
}

export interface NetworkConfig {
  youtube: {
    baseUrl: string;
    apiKey: string;
  };
}
