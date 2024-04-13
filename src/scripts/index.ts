import { writeMissingMeiliRecords } from '../db/utils';
import pingAll from './pingAll';
import { schedule } from 'node-cron';
import { deletingDocs } from './dbs';
import { getRate } from './rates/getRates';
function runScript(config: Config, dbs: DBs) {
  schedule('*/10 * * * *', () => pingAll(config), {
    scheduled: true,
    timezone: 'Africa/Lagos'
  });

  schedule('*/5 * * * *', () => writeMissingMeiliRecords(dbs), {
    scheduled: true,
    timezone: 'Africa/Lagos'
  });

  schedule('1 1 1 * *', () => deletingDocs(), {
    scheduled: true,
    timezone: 'Africa/Lagos'
  });

  schedule('*/15 * * * *', () => deletingDocs(), {
    scheduled: true,
    timezone: 'Africa/Lagos'
  });

  schedule('* * * * *', () => getRate(), {
    scheduled: true,
    timezone: 'Africa/Lagos'
  });

  setTimeout(() => getRate(), 2000);

  setTimeout(() => writeMissingMeiliRecords(dbs), 2000);

  setTimeout(() => deletingDocs(), 10000);
}

export default runScript;
