import MeiliSearch from 'meilisearch';

let updateDocument = (client: MeiliSearch) =>
  async function (indexName: any, data: any) {
    try {
      let index = await client.index(indexName);

      let updating = await index.updateDocuments([
        {
          ...data
        }
      ]);
      return updating;
    } catch (error) {
      throw error;
    }
  };
export { updateDocument };
