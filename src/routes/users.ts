import { Elysia } from 'elysia';
import {
  getUsersReq,
  getUsersRes,
  getUserReq,
  getUserRes,
  searchReq,
  disableTwoFaRes,
  disableTwoFaReq,
  manageWithdrawalReq,
  manageWithdrawalRes,
  defundUserReq,
  defundUserRes,
  manageKycReq,
  manageKycRes,
  resetAttempts,
  defaultRes
} from '../validations/users';
import getUser from '../controllers/users/getUser';
import getUsers from '../controllers/users/getUsers';
import disable2Fa from '../controllers/users/disable2Fa';
import defundUser from '../controllers/users/defundUser';
import enableAndDisableWithdrawals from '../controllers/users/manageWithdrawal';
import manageKyc from '../controllers/users/manageKyc';
import resetUserAttempts from '../controllers/users/resetAttempts';
import { authorize } from '../hooks/authentication';
import { Roles } from '../types/enums';

export default function getUserRoutes(router: Elysia, ctx: RequestContext) {
  const usersRoutes = router.group('/users', (userRoutes) => {
    userRoutes.get('/', getUsers(ctx), {
      query: getUsersReq,
      response: getUsersRes,
      beforeHandle: [authorize([Roles.customerSuccess, Roles.developer, Roles.manager]) as any],
      detail: {
        tags: ['Users'],
        description: 'Get all users'
      }
    });
    userRoutes.post('/', getUser(ctx), {
      body: getUserReq,
      response: getUserRes,
      beforeHandle: [authorize([Roles.customerSuccess, Roles.developer, Roles.manager]) as any],
      detail: {
        tags: ['Users'],
        description: 'Get a single user'
      }
    });
    userRoutes.get('/search', getUsers(ctx), {
      query: searchReq,
      response: getUsersRes,
      beforeHandle: [authorize([Roles.customerSuccess, Roles.developer, Roles.manager]) as any],
      detail: {
        tags: ['Users'],
        description: 'Search for a user'
      }
    });
    userRoutes.put('/disable-two-factor-authentication', disable2Fa(ctx), {
      body: disableTwoFaReq,
      response: disableTwoFaRes,
      beforeHandle: [authorize([Roles.superAdmin]) as any],
      detail: {
        tags: ['Users'],
        description: 'Disable 2FA for a user'
      }
    });
    userRoutes.put('/withdrawals', enableAndDisableWithdrawals(ctx), {
      body: manageWithdrawalReq,
      response: manageWithdrawalRes,
      beforeHandle: [authorize([Roles.superAdmin]) as any],
      detail: {
        tags: ['Users'],
        description: 'Enable or disable withdrawals for a user'
      }
    });
    userRoutes.put('/managekyc', manageKyc(ctx), {
      body: manageKycReq,
      response: manageKycRes,
      beforeHandle: [authorize([Roles.superAdmin]) as any],
      detail: {
        tags: ['Users'],
        description: "Manage a user's kyc"
      }
    });
    userRoutes.post('/defund', defundUser(ctx), {
      body: defundUserReq,
      response: defundUserRes,
      beforeHandle: [authorize([Roles.superAdmin]) as any],
      detail: {
        tags: ['Users'],
        description: "Defund a user's wallet"
      }
    });
    userRoutes.post('/reset-attempts', resetUserAttempts(ctx), {
      body: resetAttempts,
      response: defaultRes,
      detail: {
        tags: ['Users'],
        description: "Reset a user's sms otp attempts"
      }
    });

    return userRoutes;
  });
  return usersRoutes;
}
