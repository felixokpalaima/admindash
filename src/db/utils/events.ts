import { EventEmitter } from 'events';
import { watchDb, writeMissingMeiliRecords } from '.';
import { dbs } from '..';

export const emitter = new EventEmitter();

emitter.on('dbReconnected', function (data: { name: DbName; db: Partial<DBs> }) {
  const { name, db } = data;
  console.log({ ...dbs, [name]: db });
  setTimeout(() => writeMissingMeiliRecords(dbs), 2000);
  watchDb({ ...dbs, [name]: db }, [name]);
});
