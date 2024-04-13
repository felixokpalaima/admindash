import MeiliSearch, { DocumentsDeletionQuery, Settings } from 'meilisearch';

let deleteDocuments = (client: MeiliSearch) =>
  async function (indexName: any, query: DocumentsDeletionQuery) {
    try {
      let index = await client.index(indexName);
      let deletingData = await index.deleteDocuments(query);
      return deletingData;
    } catch (error) {
      throw error;
    }
  };

export { deleteDocuments };
