import Basegateway from './baseGateway';
import getConfig from '../config';
const config = getConfig();

const bendGateway = new Basegateway({
  headers: {
    'Content-Type': 'application/json'
    // 'x-api-key': `${config.API_KEY}`,
    // 'x-api-user': `${config.API_USER}`
  },
  baseUrl: `${config.BASE_URLS.bend}`
});

export { bendGateway };
