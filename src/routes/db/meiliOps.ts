import { Elysia } from 'elysia';
import dropIndex from '../../controllers/dbOperations/dropIndex';
import addDocs from '../../controllers/dbOperations/addDocs';
import createKey from '../../controllers/dbOperations/createAPIKey';
import getKey from '../../controllers/dbOperations/getAPIKey';
import getKeys from '../../controllers/dbOperations/getAPIKeys';
import deleteAPIKey from '../../controllers/dbOperations/deleteAPIKey';
import updateAPIKey from '../../controllers/dbOperations/updateAPIKey';
import generateToken from '../../controllers/dbOperations/createToken';
import { DropIndexReq } from '../../validations/indexes';
import { authorizeIndexModifier } from '../../hooks/authentication';

export default function db(router: Elysia, ctx: RequestContext) {
  router = new Elysia();
  router.get('/merge-collections', addDocs(ctx), {
    beforeHandle: [authorizeIndexModifier(ctx) as any]
  });
  router.get('/drop-index', dropIndex(ctx), {
    query: DropIndexReq,
    beforeHandle: [authorizeIndexModifier(ctx) as any]
  });
  router.post('/create-key', createKey(ctx));
  router.get('/get-key', getKey(ctx));
  router.get('/get-keys', getKeys(ctx));
  router.post('/delete-key', deleteAPIKey(ctx));
  router.post('/update-key', updateAPIKey(ctx));
  router.post('/create-token', generateToken(ctx));

  return router;
}
