import { connectToMultipleDbs } from './connectToMongoDB';
import helpers from '../../utils/helpers';
import fetchAndMergeSettings from './settings/settings';
import { addDocsOnce } from './managers';
import getConfig from '../../config';
import { DateTime } from 'luxon';
const config = getConfig();
const { APP_ENV } = config;
const period = helpers.mapAppEnv(APP_ENV) === 'production' ? { years: 1 } : { months: 3 };
const fromTime = DateTime.now().minus(period).toISODate();
const fetchDataFromRequiredCollections: FetchData = async (connectedDbs: ConnectedDbs) => {

  let allData = {} as FetchedData;
  let locators = {} as Locators;
  for (const dbName in connectedDbs) {
    let connection = connectedDbs[dbName as DbName];
    let collectionsNeeded = fetchAndMergeSettings['remote'][dbName as DbName].collections;
    locators[dbName as DbName] = {};

    let fetched = collectionsNeeded.map(async (collectionNeeded, i) => {
      // [ { colName: [] } ]
      let data = await connection.db.collection(collectionNeeded)
      .aggregate([{ $match: { createdAt: { $gte: new Date(fromTime) } } }])
      .toArray();
      data = data.map((doc) => {
        return { ...doc, source: `${dbName}/${collectionNeeded}` };
      });
      locators[dbName as DbName][collectionNeeded] = i;
      return {
        [collectionNeeded]: data
      };
    });

    let promisedAll = await Promise.all(fetched);
    allData[dbName as DbName] = promisedAll; //{ biz: [ { colName: [] } ], ventogram: [ { colName: [] } ] }
  }

  return {
    locators,
    allData
  };
};

const merger: Merger = function (fetchedData) {
  let { locators, allData } = fetchedData;
  let merged = {} as MergedData;
  let presetMergers = fetchAndMergeSettings.mergeCollections;
  let newCollections = Object.keys(presetMergers);
  newCollections.map(function (newCollection) {
    let collectionsToBeMerged = presetMergers[newCollection as NewCollections].mergeThese; // []
    let data = [] as any;

    for (let i = 0; i < collectionsToBeMerged.length; i++) {
      let collectionToBeMerged = collectionsToBeMerged[i];

      let preData = allData[collectionToBeMerged.location];

      data = [
        ...data,
        ...preData[locators[collectionToBeMerged.location][collectionToBeMerged.collection]][
          collectionToBeMerged.collection
        ]
      ];
    }
    data = data.map((datum: any) =>
      presetMergers[newCollection as NewCollections].mergeShape.merger(
        presetMergers[newCollection as NewCollections].mergeShape,
        datum
      )
    );

    merged[newCollection as NewCollections] = helpers.sorter(
      data.filter((datum: any) => !datum.expires)
    );
  });

  return merged;
};

const connecting = async (fetchDataFromRequiredCollections: FetchData, merger: Merger) => {
  try {
    const { connections: connectedDbs, mongoose } = await connectToMultipleDbs(
      fetchAndMergeSettings.remote
    );
    console.log('connected now');
    let fetched = await fetchDataFromRequiredCollections(connectedDbs);
    let merged = merger(fetched);
    await mongoose.disconnect();
    for (const collection in merged) {
      const { databaseSettings } =
        fetchAndMergeSettings.mergeCollections[collection as NewCollections];
      await addDocsOnce(collection, merged[collection], databaseSettings);
    }
    return 'done';
  } catch (error) {
    throw { error };
  }
};

const runConnectionAndMerge = async () =>
  await connecting(fetchDataFromRequiredCollections, merger);

export { runConnectionAndMerge };
