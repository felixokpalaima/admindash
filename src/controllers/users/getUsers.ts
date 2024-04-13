import { KycMerchant } from '../../types/enums';
import makeController from '../../utils/makeController';
import { MongoError } from 'mongodb';

export async function getUsers(ctx: RequestContext, req: any) {
  try {
    const { perPage = 20, page = 1, query: searchQuery } = req.query;

    let search = false;
    let searchFields: Array<string> = [];
    if (searchQuery) {
      search = true;
      searchFields = ['email', 'username', 'phone'];
    }
    const offset = Number(perPage) * (Number(page) - 1);
    const data = await ctx.dbs.biz.paginatedGet(
      'usersV2',
      {},
      Number(perPage),
      offset,
      search,
      searchFields,
      { query: searchQuery }
    );

    const users = data.data;
    const usersData = [];

    for (const user of users!) {
      const userBalance = await ctx.dbs.biz.get('balancev2', { username: user.username });
      const balanceData = [];
      if (userBalance) {
        for (const balance of userBalance) {
          const { currency, amount, canWithdraw } = balance;
          balanceData.push({ currency, amount, canWithdraw });
        }
      }

      const userKycDetails = await ctx.dbs.biz.get('kycs', { username: user.username });
      let bvn;
      let kycStatus;
      if (userKycDetails?.length) {
        kycStatus = userKycDetails[0].kycLevel;
        bvn =
          userKycDetails[0].verificationMerchant === KycMerchant.mono && userKycDetails[0].recordId;
      }

      const userData = {
        fullName: user.fullname,
        username: user.username,
        phone: user.phone,
        countryCode: user.countryCode,
        email: user.email,
        mfaEnrolled: Boolean(user.mfa?.enrolled),
        accountCreated: user.createdAt,
        ...(kycStatus ? { kycStatus } : {}),
        ...(bvn ? { bvn } : {}),
        ...(balanceData.length ? { balances: balanceData } : {})
      };
      usersData.push(userData);
    }

    const total = data.total;
    const pages = Math.ceil(total / perPage);

    return {
      success: true,
      message: 'Get users success',
      data: { users: usersData, pages: { total, perPage, pages } }
    };
  } catch (error: any) {
    if (error instanceof MongoError) {
      ctx.getLogger('error').error(error.message);
      return {
        success: false,
        message: error.message,
        statusCode: 500
      };
    }

    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      message: 'Get users request errored',
      statusCode: 500
    };
  }
}

export default makeController(getUsers);
