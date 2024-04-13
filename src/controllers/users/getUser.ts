import { MongoError } from 'mongodb';
import { KycMerchant } from '../../types/enums';
import makeController from '../../utils/makeController';

export async function getUser(ctx: RequestContext, req: any) {
  try {
    const { username, email } = req.body;
    const user = username
      ? await ctx.dbs.biz.getOne('usersV2', { username })
      : await ctx.dbs.biz.getOne('usersV2', { email });
    ctx.log.info({ user }, 'get user db response');
    if (!user) {
      return {
        message: `User [${username}] not found`,
        statusCode: 404,
        success: false
      };
    }

    const userBalance = await ctx.dbs.biz.get('balancev2', { username });
    ctx.log.info({ userBalance }, 'get user balance db response');
    const balanceData = [];
    let withdrawalEnabled = true;

    if (userBalance) {
      for (const balance of userBalance) {
        const { currency, amount, canWithdraw } = balance;
        if (!canWithdraw) {
          withdrawalEnabled = false;
        }
        balanceData.push({ currency, amount, canWithdraw });
      }
    }

    const userKycDetails = await ctx.dbs.biz.get('kycs', { username: user.username });
    ctx.log.info({ userKycDetails }, 'get user kyc db response');
    let bvn;
    let kycStatus;
    if (userKycDetails?.length) {
      kycStatus = userKycDetails[0].kycLevel;
      bvn =
        userKycDetails[0].verificationMerchant === KycMerchant.mono && userKycDetails[0].recordId;
    }

    const userData = {
      fullName: user.fullname,
      username,
      phone: user.phone,
      countryCode: user.countryCode,
      email: user.email,
      mfaEnrolled: Boolean(user.mfa?.enrolled),
      accountCreated: user.createdAt,
      kycStatus,
      bvn,
      withdrawalEnabled,
      balances: balanceData
    };

    return {
      success: true,
      message: `User [${username}] retrieved successfully`,
      data: { ...userData }
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
      message: 'Get user request errored',
      statusCode: 500
    };
  }
}

export default makeController(getUser);
