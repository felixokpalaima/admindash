import MeiliSearch, { DocumentQuery, DocumentsQuery, SearchParams } from 'meilisearch';

let searchDocuments = (client: MeiliSearch) =>
  async function (indexName: any, query?: string, searchParams?: SearchParams) {
    try {
      let index = await client.index(indexName);
      let doc = await index.search(query, { ...searchParams });
      return doc;
    } catch (error) {
      throw error;
    }
  };

let getDocuments = (client: MeiliSearch) =>
  async function (indexName: any, queryParams?: DocumentsQuery) {
    try {
      let index = await client.index(indexName);
      let docs = await index.getDocuments(queryParams);
      return docs;
    } catch (error) {
      throw error;
    }
  };

let getDocumentById = (client: MeiliSearch) =>
  async function (indexName: any, id: string, queryParams?: DocumentQuery) {
    try {
      let index = await client.index(indexName);
      let doc = await index.getDocument(id, queryParams);
      return doc;
    } catch (error) {
      throw error;
    }
  };

export { getDocuments, getDocumentById, searchDocuments };
