import MeiliSearch from 'meilisearch';

const createKey = (client: MeiliSearch) =>
  async function (createKey: CreateAPIKey) {
    try {
      let keyDetails = await client.createKey(createKey);
      return keyDetails;
    } catch (error) {
      throw error;
    }
  };

const getKey = (client: MeiliSearch) =>
  async function (uid: string) {
    try {
      let keyDetails = await client.getKey(uid);
      return keyDetails;
    } catch (error) {
      throw error;
    }
  };

const getKeys = (client: MeiliSearch) =>
  async function (limit?: number) {
    try {
      let keyDetails = limit ? await client.getKeys({ limit }) : await client.getKeys();
      return keyDetails;
    } catch (error) {
      throw error;
    }
  };

const updateKey = (client: MeiliSearch) =>
  async function (updateKey: Partial<CreateAPIKey>, uid: string) {
    try {
      let keyDetails = await client.updateKey(uid, updateKey);
      return keyDetails;
    } catch (error) {
      throw error;
    }
  };

const deleteKey = (client: MeiliSearch) =>
  async function (uid: string) {
    try {
      let keyDetails = await client.deleteKey(uid);
      return keyDetails;
    } catch (error) {
      throw error;
    }
  };

export { createKey, updateKey, getKey, getKeys, deleteKey };
