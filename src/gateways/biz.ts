import Basegateway from './baseGateway';
import getConfig from '../config';

const config = getConfig();
const bizGateway = new Basegateway({
  headers: {
    'Content-Type': 'application/json',
    'x-user-version': 'v2.0'
    // 'x-api-key': `${config.API_KEY}`,
    // 'x-api-user': `${config.API_USER}`
  },
  baseUrl: `${config.BASE_URLS.biz}`
});

export { bizGateway };
