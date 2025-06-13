import { createClient, LogglyInstance } from 'loggly';
import { AppConfigService } from '../../../config/app-config.service';

export class LogglyClient {
  private static instance: LogglyClient;
  private readonly client: LogglyInstance;

  private constructor() {
    const config = AppConfigService.getConfig();
    this.client = createClient({
      token: config.logglyConfig.token,
      subdomain: config.logglyConfig.subdomain,
      auth: {
        username: config.logglyConfig.username,
        password: config.logglyConfig.password,
      },
      json: true,
      tags: [ config.environment, ],
    });
  }

  static getClient(): LogglyInstance {
    if (!LogglyClient.instance) {
      LogglyClient.instance = new LogglyClient();
    }

    return LogglyClient.instance.client;
  }
}
