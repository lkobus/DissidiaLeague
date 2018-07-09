import { EnvConfig } from './env-config.interface';
import Config from '../config';

const HomologConfig: EnvConfig = {
  ENV: 'DEV',
  API: 'http://localhost:9000/RTM/',
  CURRENT_HOST: 'http://localhost:' + Config.PORT
};

export = HomologConfig;

