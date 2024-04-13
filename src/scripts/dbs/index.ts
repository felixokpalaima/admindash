//3months for staging
//1year for production
import { deleteDocs } from '../../db/meiliSearch/managers';
import getConfig from '../../config';
import { mapAppEnv } from '../../utils/helpers';
const config = getConfig();
const now = Date.now();
const threeMonths = 0.25 * 365 * 24 * 60 * 60 * 1000;
const threeMonthsAgo = now - threeMonths;
const oneYear = 365 * 24 * 60 * 60 * 1000;
const oneYearAgo = now - oneYear;

const filter = [
  `envType = ${mapAppEnv(config.APP_ENV)}`,
  `createdAtTimestamp < ${mapAppEnv(config.APP_ENV) === 'production' ? oneYearAgo : threeMonthsAgo}`
];

const deletingDocs = async () => {
  await deleteDocs('Transactions', { filter: filter });
};

export { deletingDocs };
