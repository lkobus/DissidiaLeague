import { EnvConfig } from './env-config.interface';
import Config from '../config';

const BaseConfig: EnvConfig = {
  // Sample API url
  API: 'http://localhost:56043/RTM/',
  // API: 'http://jenkins.app.hbsis.com.br:8089/rtm/',
  CAIXA: Config.CAIXA
};

export = BaseConfig;

