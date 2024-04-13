import MeiliSearch, { Settings } from 'meilisearch';

let addDocument = (client: MeiliSearch) =>
  async function (indexName: any, data: Record<string, any>) {
    try {
      let index = await client.index(indexName);
      let creatingData = await index.addDocuments([data], { primaryKey: 'id' });
      return creatingData;
    } catch (error) {
      throw error;
    }
  };

let addDocumentsOnce = (client: MeiliSearch) =>
  async function (indexName: any, data: any, settings?: Settings) {
    try {
      let index = await client.index(indexName);
      if (settings) await index.updateSettings(settings);

      let creatingData = await index.addDocumentsInBatches(data, 6000, { primaryKey: 'id' });
      return creatingData;
    } catch (error) {
      throw error;
    }
  };
export { addDocumentsOnce, addDocument };
