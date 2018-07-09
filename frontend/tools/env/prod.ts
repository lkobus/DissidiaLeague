import { EnvConfig } from './env-config.interface';
import Config from '../config';
const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  API: 'http://localhost:62222/rtm/',
  //  API: 'http://localhost/RTM/RTM/',
  // API: 'http://jenkins.app.hbsis.com.br:8089/rtm/',
  CURRENT_HOST: 'http://localhost:62223'
};

export = ProdConfig;

