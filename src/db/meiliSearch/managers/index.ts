import { MeiliSearch } from 'meilisearch';
import { addDocument, addDocumentsOnce } from './addDocuments';
import { dropIndex } from './dropIndex';
import { getDocumentById, getDocuments, searchDocuments } from './getDocuments';
import getConfig from '../../../config';
import { updateDocument } from './updateDocument';
import { createKey, deleteKey, getKey, getKeys, updateKey } from './apiKey';
import { createTokenFunc } from './tokens';
import { deleteDocuments } from './deleteDocuments';

const config = getConfig();

const client: MeiliSearch = new MeiliSearch({
  host: config.MEILI_CONFIG.host,
  apiKey: config.MEILI_CONFIG.apiKey,
  timeout: 100 * 1000
});

const addDocsOnce = addDocumentsOnce(client);
const indexDropper = dropIndex(client);
const getDocs = getDocuments(client);
const addDoc = addDocument(client);
const getDocById = getDocumentById(client);
const searchDocs = searchDocuments(client);
const updateDoc = updateDocument(client);
const createAPIKey = createKey(client);
const getAPIKey = getKey(client);
const getAPIKeys = getKeys(client);
const updateAPIKey = updateKey(client);
const deleteAPIKey = deleteKey(client);
const createToken = createTokenFunc(client);
const deleteDocs = deleteDocuments(client);
export {
  addDocsOnce,
  addDoc,
  indexDropper,
  getDocs,
  getDocById,
  searchDocs,
  updateDoc,
  createAPIKey,
  getAPIKey,
  getAPIKeys,
  updateAPIKey,
  deleteAPIKey,
  createToken,
  deleteDocs
};
