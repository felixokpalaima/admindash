import { getDocs, searchDocs } from '../../../db/meiliSearch/managers';
import makeController from '../../../utils/makeController';
import { MeiliSearchApiError, MeiliSearchError } from 'meilisearch';
import helpers, { fixAmounts, mapAppEnv, getterMap, propertiesMap } from '../../../utils/helpers';
import getConfig from '../../../config';
import { detailsMap } from '../../../db/utils';
const config = getConfig();

const toOrFromAccount = {
  voucher: `fromAccount`
};
export async function getAll(ctx: RequestContext, req: any) {
  try {
    let { query = '', perPage = 50, page = 1, ...filters } = req.query;
    perPage = +perPage;
    page = +page;
    let currencyFilterStatment = '';

    for (const f in filters) {
      if (filters[f] === '') delete filters[f];
    }
    if (filters.type) {
      let { type } = filters;
      delete filters['type'];
      filters['transactionType'] = type;
    }
    if (filters.currency) {
      let { currency } = filters;
      delete filters['currency'];
      currencyFilterStatment = `AND (fromCurrency = ${currency} OR toCurrency = ${currency})`;
    }
    const { limit, offset } = helpers.calcQueryParams(page, perPage);
    const {
      userDetails: {
        user: { username }
      }
    } = req.store;
    const envFilter = `AND (envType = ${mapAppEnv(config.APP_ENV)})`;
    const defaultFilterStatement = `(fromAccount = ${username} OR toAccount = ${username}) ${currencyFilterStatment} ${envFilter}`;
    const otherFilters = helpers.contructFilter(filters);

    let { hits, totalPages } = (await searchDocs('Transactions', query, {
      sort: ['createdAt:desc'],
      filter:
        otherFilters === `AND` ? [defaultFilterStatement] : [defaultFilterStatement, otherFilters],
      limit,
      offset,
      page,
      hitsPerPage: perPage
    })) as any;
    const fetchOtherDetails = await Promise.all(
      hits.map(async (hit: any) => {
        const { transactionType } = hit;
        const field = toOrFromAccount[transactionType as keyof typeof toOrFromAccount];
        const reference = getterMap[transactionType as keyof typeof getterMap];
        const property = propertiesMap[transactionType as keyof typeof propertiesMap];
        if (Object.keys(toOrFromAccount).includes(transactionType))
          return {
            ...hit,
            [field]: (
              (await detailsMap[transactionType as keyof typeof detailsMap](hit[reference])) as any
            )[property]
          };
        else {
          return { ...hit };
        }
      })
    );
    return {
      success: true,
      statusCode: 200,
      message: 'successful',
      data: {
        results: fetchOtherDetails.map((hit: any) => {
          const { isMerchantBalanceTransfer } = hit;
          if (isMerchantBalanceTransfer) {
            hit.fromAccount = hit.fromBalance;
            hit.toAccount = hit.toBalance;
          }
          return {
            ...hit,
            fromAmount: fixAmounts(hit.fromAmount, hit.fromCurrency),
            toAmount: fixAmounts(hit.toAmount, hit.toCurrency)
          };
        }),
        total: totalPages,
        page,
        perPage
      }
    };
  } catch (error: any) {
    let message: string = error.message;
    if (error instanceof MeiliSearchApiError || error instanceof MeiliSearchError) {
      message = error.message;
    }

    ctx.getLogger('error').error(message);
    return {
      success: false,
      statusCode: 500,
      message: message
    };
  }
}

export default makeController(getAll);
