import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import speak from 'speakeasy';

import getConfig from '../config';
import { Roles } from '../types/enums';
const config = getConfig();

const authorize = (roles: RolesArray) => (ctx: HookContext) => {
  let { headers, set, store } = ctx;
  const bearerHeader = headers['authorization'];
  if (!bearerHeader) {
    set.status = 401;
    return 'Access Denied.';
  }
  const [, token] = bearerHeader.split(' ');
  try {
    const jwtPayload = jwt.verify(token, config.JWT_PUB_KEY, {
      algorithms: ['RS256']
    }) as JwtPayload;

    // if (!roles.includes(jwtPayload.role) && jwtPayload.role !== Roles.superAdmin) {
    //   set.status = 401;
    //   return 'Access Denied!';
    // }

    if (
      !jwtPayload.roles.some((role: any) => roles.includes(role)) &&
      !jwtPayload.roles.includes(Roles.superAdmin)
    ) {
      set.status = 403;
      return 'Forbidden!';
    }

    store['adminDetails'] = { ...jwtPayload, token };
  } catch (e) {
    set.status = 401;
    let message = 'Access Denied!';
    if (e instanceof TokenExpiredError) {
      message = 'Access token has expired';
    }
    if (e instanceof JsonWebTokenError) {
      message = e.message;
    }
    return message;
  }
};

const authorizeMerchant =
  (roles: RolesArray, ctx: RequestContext, isLogin?: boolean) => async (hookCtx: HookContext) => {
    const { headers, set, store, body } = hookCtx;

    const bearerHeader = headers['authorization'];
    if (!bearerHeader) {
      set.status = 401;
      return {
        message: 'Access Denied.',
        status: 401,
        success: false
      };
    }
    const [, token] = bearerHeader.split(' ');

    try {
      const jwtPayload = jwt.verify(token, config.JWT_PUB_KEY, {
        algorithms: ['RS256']
      }) as JwtPayload;

      if (!jwtPayload) {
        set.status = 403;
        return {
          message: 'Forbidden!',
          status: 403,
          success: false
        };
      }

      if (!roles.includes(Roles.customerSuccess)) {
        if (jwtPayload.roles.includes(Roles.customerSuccess)) {
          set.status = 403;
          return {
            message: 'Unauthorized',
            status: 401,
            success: false
          };
        }
      }

      const user =
        (await ctx.dbs.biz.getOne('usersV2', { id: jwtPayload.sub })) ??
        (await ctx.dbs.biz.getOne('usersV2', { id: jwtPayload.subAccountUser }));

      if (!user) {
        set.status = 404;
        return {
          message: 'No user found for this token',
          status: 404,
          success: false
        };
      }

      store['userDetails'] = { ...jwtPayload, token, user };

      if (isLogin) {
        if (!user.mfa?.secret) {
          set.status = 404;
          return {
            message: 'Mfa does not exist for this user',
            status: 404,
            success: false
          };
        }

        const verified = speak.totp.verify({
          secret: user.mfa.secret,
          encoding: 'base32',
          token: body.mfaCode,
          window: 1
        });

        if (!verified) {
          set.status = 401;
          return {
            message: 'Enter valid totp',
            status: 401,
            success: false
          };
        }
      }
    } catch (e) {
      set.status = 401;
      let message = 'Access Denied!';
      if (e instanceof TokenExpiredError) {
        message = 'Access token has expired';
      }
      if (e instanceof JsonWebTokenError) {
        message = e.message;
      }
      return {
        message,
        status: 401,
        success: false
      };
    }
  };

const authorizeIndexModifier = (ctx: RequestContext) => async (hookCtx: HookContext) => {
  const { headers, set } = hookCtx;

  const bearerHeader = headers['authorization'];
  if (!bearerHeader) {
    set.status = 401;
    return {
      message: 'Access Denied.',
      status: 401,
      success: false
    };
  }
  const [, token] = bearerHeader.split(' ');
  const authorizedModifiers = config.INDEX_MODIFIERS as Array<string>;
  try {
    const jwtPayload = jwt.verify(token, config.JWT_PUB_KEY, {
      algorithms: ['RS256']
    }) as JwtPayload;

    const user = await ctx.dbs.biz.getOne('usersV2', { email: jwtPayload.email });

    if (!user?.username) {
      set.status = 404;
      return {
        message: 'No user found for this token',
        status: 404,
        success: false
      };
    }

    if (!authorizedModifiers.includes(user.username)) {
      set.status = 403;
      return {
        message: 'Forbidden!',
        status: 403,
        success: false
      };
    }
  } catch (e) {
    set.status = 401;
    let message = 'Access Denied!';
    if (e instanceof TokenExpiredError) {
      message = 'Access token has expired';
    }
    if (e instanceof JsonWebTokenError) {
      message = e.message;
    }
    return {
      message,
      status: 401,
      success: false
    };
  }
};

const authorizeBalanceTransfer =
  (ctx: RequestContext, req: any) => async (hookCtx: HookContext) => {
    const { set } = hookCtx;

    const {
      userDetails: { user }
    } = req.store;

    try {
      const ventogramMerchant = await ctx.dbs.ventogram.getOne('merchants', {
        username: user.username,
        email: user.email
      });

      if (!ventogramMerchant) {
        set.status = 403;
        return {
          message: 'No ventogram merchant found to match this user',
          status: 403,
          success: false
        };
      }
    } catch (e) {
      return {
        message: 'Failed to authorize balance transfer',
        status: 401,
        success: false
      };
    }
  };

export { authorize, authorizeMerchant, authorizeIndexModifier, authorizeBalanceTransfer };
