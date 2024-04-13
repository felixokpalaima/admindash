import MeiliSearch from 'meilisearch';

let dropIndex = (client: MeiliSearch) =>
  async function (indexName: any) {
    try {
      let index = await client.index(indexName);
      let droping = await index.delete();
      return droping;
    } catch (error) {
      throw error;
    }
  };

export { dropIndex };
