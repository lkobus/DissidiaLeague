import { EnvConfig } from './env-config.interface';
import Config from '../config';
const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  API: 'http://dissidia.eastus.cloudapp.azure.com',
  //  API: 'http://localhost/RTM/RTM/',
  // API: 'http://jenkins.app.hbsis.com.br:8089/rtm/',
  CURRENT_HOST: 'http://localhost:' + Config.PORT
};

export = ProdConfig;

