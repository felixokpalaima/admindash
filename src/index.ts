import getConfig from './config';
import getDB from './db';
import { watchDb } from './db/utils';
import getLogger from './logging';
import getRoutes from './routes';
import runScript from './scripts';
import startServer from './server';

const envConfig = getConfig();
const dbs = await getDB(envConfig.DB_CONN_STRINGS);
watchDb(dbs);
if (envConfig.CONTAINER_NAME === 'admindash') {
  runScript(envConfig, dbs);
}
startServer(envConfig, getRoutes({ config: envConfig, dbs, log: getLogger(''), getLogger }));
