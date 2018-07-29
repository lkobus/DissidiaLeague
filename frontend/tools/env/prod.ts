import { EnvConfig } from './env-config.interface';
import Config from '../config';
const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  API: 'http://192.168.0.13:62222/rtm/',
  //  API: 'http://localhost/RTM/RTM/',
  // API: 'http://jenkins.app.hbsis.com.br:8089/rtm/',
  CURRENT_HOST: 'http://localhost:' + Config.PORT
};

export = ProdConfig;

