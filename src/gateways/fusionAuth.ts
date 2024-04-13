import Basegateway from './baseGateway';
import getConfig from '../config';

const config = getConfig();
const fusionAuthAdminGateway = new Basegateway({
  headers: {
    Authorization: `${config.FUSION_AUTH_ADMIN_API_KEY}`,
    'X-FusionAuth-TenantId': `${config.FUSION_AUTH_ADMIN_TENANT_ID}`
  },
  baseUrl: `${config.FUSION_AUTH_BASE_URL}`
});

const fusionAuthCoinprofileGateway = new Basegateway({
  headers: {
    Authorization: `${config.FUSION_AUTH_COINPROFILE_API_KEY}`,
    'X-FusionAuth-TenantId': `${config.FUSION_AUTH_COINPROFILE_TENANT_ID}`
  },
  baseUrl: `${config.FUSION_AUTH_BASE_URL}`
});

export { fusionAuthAdminGateway, fusionAuthCoinprofileGateway };
