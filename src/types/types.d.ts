type Connection = import('mongoose').Connection;
type SchemaType = import('../db/schema/index').SchemaType;

type FetchedData = Record<DbName, Array<Record<string, any[]>>>;
type Locators = Record<DbName, Record<string, number>>;
type Reshape = (shape: any, doc: any) => any;
type Merger = (fetcheData: any) => any;
type MergedData = Record<NewCollections, any>;
type ConnectedDbs = Record<DbName, Connection>;
type FetchData = (
  connectedDbs: ConnectedDbs
) => Promise<{ allData: FetchedData; locators: Locators }>;
type DbName = keyof SchemaType;
type DBAndCollectionNamesDefinition<T> = Partial<{
  [K in keyof T]: Array<keyof T[K]>;
}>;

type WriteTo = 'missedMeiliRecords';
type Watched = DBAndCollectionNamesDefinition<SchemaType>;

type CollectionNamesDefinition<T> = Partial<{
  [K in keyof T]: keyof T[K];
}>;

type CollectionNames =
  CollectionNamesDefinition<SchemaType>[keyof CollectionNamesDefinition<SchemaType>];
