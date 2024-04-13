import MeiliSearch from 'meilisearch';

const createTokenFunc = (client: MeiliSearch) =>
  async function (envType: string, apiKeyDetails: any) {
    const { apiKeyUid, apiKey, expiresAt } = apiKeyDetails;
    try {
      const searchRules = {
        '*': {
          filter: `envType = ${envType}`
        }
      };
      let tokenDetails = await client.generateTenantToken(apiKeyUid, searchRules, {
        apiKey,
        expiresAt: new Date(expiresAt)
      });
      return tokenDetails;
    } catch (error) {
      throw error;
    }
  };

export { createTokenFunc };
