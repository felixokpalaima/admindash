import Basegateway from './baseGateway';
import getConfig from '../config';

const config = getConfig();
const ventogramGateway = new Basegateway({
  headers: {},
  baseUrl: `${config.BASE_URLS.ventogram}`
});

export { ventogramGateway };
