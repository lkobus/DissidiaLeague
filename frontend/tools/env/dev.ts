import { EnvConfig } from './env-config.interface';
import Config from '../config';

const DevConfig: EnvConfig = {
  ENV: 'DEV',
  API: 'http://localhost:8999/',   
  //  API: 'http://localhost/RTM/RTM/',
  // API: 'http://jenkins.app.hbsis.com.br:8089/rtm/',
  CURRENT_HOST: 'http://localhost:' + Config.PORT
};

export = DevConfig;

