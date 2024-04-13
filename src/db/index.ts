import { Db, MongoClient, ObjectId, ServerClosedEvent, WithId } from 'mongodb';
import { dbSchema } from './schema';
import { emitter } from './utils/events';
import { debounce, delay } from '../utils/helpers';
type DBSchemaKeys = keyof typeof dbSchema;
export type ConnectionStrings = Record<DBSchemaKeys, string>;
type DBSchema = (typeof dbSchema)[DBSchemaKeys];

class BaseDB<Schema extends DBSchema> {
  private _client: MongoClient | null = null;
  private _db: Db | null = null;
  private _initiated: boolean = false;
  constructor(_schema: Schema) {}

  async init(dbAlias: string, connStr: string) {
    if (this._initiated) {
      return;
    }
    this._client = new MongoClient(connStr, {
      connectTimeoutMS: 10 * 1000
    });

    this._client.on('open', () => {
      console.log(`${dbAlias} db opened`);
    });

    this._client.on('error', (err) => {
      console.log(`error connecting to ${dbAlias}`, err);
    });

    this._client.on('serverClosed', async (_data: ServerClosedEvent) => {
      emitter.emit('serverClosed', { dbAlias, connStr });
    });

    await this._client.connect();
    console.log(`connected to ${dbAlias}`);
    this._db = this._client.db();
    this._initiated = true;
  }
  async create(collection: WriteTo, data: any) {
    const col = this._db?.collection(collection as string);
    return col?.insertOne(data, {});
  }
  async watchCollection(collectionName: string, fn: (data: any) => any): Promise<void> {
    this._db
      ?.collection(collectionName)
      .watch(undefined, { fullDocument: 'whenAvailable' })
      .on('change', async (data: any) => {
        await fn(data);
      });
  }

  async get<k extends keyof Schema>(
    collection: k,
    query: Partial<Schema[k] | {}>,
    search: Boolean = false
  ): Promise<WithId<Schema[k]>[] | null> {
    const col = this._db?.collection(collection as string);
    return col?.find(query).toArray() as Promise<WithId<Schema[k]>[] | null>;
  }

  async countDocuments<k>(collection: k, filter?: Partial<k | {}>) {
    const counted = this._db?.collection(collection as string).countDocuments(filter);
    return counted || 0;
  }

  async getOne<k extends keyof Schema>(
    collection: k,
    query: Partial<Schema[k]>
  ): Promise<Partial<Schema[k]> | null> {
    const col = this._db?.collection(collection as string);
    return col?.findOne(query) as Promise<Partial<Schema[k]> | null>;
  }

  async updateOne<k extends keyof Schema>(
    collection: k,
    filter: any,
    data: Partial<Schema[k]>
  ): Promise<Partial<Schema[k]> | null> {
    const col = this._db?.collection(collection as string);
    return col?.findOneAndUpdate({ ...filter }, { $set: { ...data } }) as Promise<Partial<
      Schema[k]
    > | null>;
  }

  async getOneById<k extends keyof Schema>(
    collection: k,
    id: any
  ): Promise<Partial<Schema[k]> | null> {
    const col = this._db?.collection(collection as string);
    return col?.findOne({ _id: new ObjectId(id) }) as Promise<Partial<Schema[k]> | null>;
  }

  async paginatedGet<k extends keyof Schema>(
    collection: k,
    query: Partial<Schema[k] | {}>,
    perPage: number,
    offset: number,
    search: Boolean = false,
    searchFields: Array<string> = [],
    searchQuery?: { query: string }
  ): Promise<{ total: number; data: Partial<Schema[k]>[] | null }> {
    const col = this._db?.collection(collection as string);
    if (search) {
      let searchParam = searchQuery?.query;
      let newQuery = searchFields?.map((searchField) => {
        return {
          [searchField]: new RegExp(`.*${searchParam}.*`)
        };
      });

      query = { $or: [...newQuery], ...query };
    }

    const data = (await col
      ?.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(perPage)
      .toArray()) as WithId<Schema[k]>[];

    const transformedData = data?.map((item) => item as Partial<Schema[k]>) || null;

    const total = search
      ? (await col?.find(query).toArray())?.length || 0
      : (await col?.countDocuments(query)) || 0;

    return { total, data: transformedData };
  }
}

export const dbs = {
  biz: new BaseDB(dbSchema.biz),
  cards: new BaseDB(dbSchema.cards),
  waas: new BaseDB(dbSchema.waas),
  ventogram: new BaseDB(dbSchema.ventogram)
};

export type DBs = typeof dbs;
async function reconnectListener(data: { dbAlias: string; connStr: string }) {
  const { dbAlias, connStr } = data;
  let newDbConnection = new BaseDB(dbSchema[dbAlias as DBSchemaKeys]);
  await newDbConnection.init(dbAlias, connStr);
  emitter.emit('dbReconnected', { name: dbAlias, db: newDbConnection });
}
const debounceReconnectListener = debounce(
  async (data: { dbAlias: string; connStr: string }) => await reconnectListener(data),
  300
);
emitter.on('serverClosed', async (data) => {
  delay(0.15);
  debounceReconnectListener(data);
});

export default async function getDB(connStrs: ConnectionStrings) {
  for (const dbName of Object.keys(dbs)) {
    const connStr = connStrs[dbName as DBSchemaKeys];
    if (!connStr) {
      throw new Error(`Connection string for ${dbName} is missing`);
    }
    await dbs[dbName as DBSchemaKeys].init(dbName, connStr);
  }
  return dbs;
}
