export const parseEnvNum = (key: string, required = true): number | undefined => {
  const value = process.env[key];
  const parsedValue = value ? parseInt(value, 10) : undefined;
  if (required && parsedValue === undefined) {
    throw `Value of ${key} must be a number!`;
  }
  return parsedValue;
};

export const parseEnvObject = <T>(key: string): T => {
  const value = process.env[key];
  let parsedValue: T;
  if (!value) {
    throw `Value of ${key} must be an object!`;
  }
  try {
    parsedValue = JSON.parse(value);
  } catch (error) {
    throw `Error parsing ${key} as JSON!`;
  }

  return parsedValue;
};

const decodeBase64 = (encodedStr: string): string => {
  return Buffer.from(encodedStr, 'base64').toString();
};

export const parseEnvString = <T>(key: string, required = true): string | undefined => {
  const value = process.env[key];
  if (required && !value) {
    throw `Value of ${key} must be a string!`;
  }
  return value;
};

export default function getConfig() {
  return {
    APP_ENV: parseEnvString('APP_ENV')!,
    PORT: parseEnvNum('PORT')!,
    APP_NAME: parseEnvString('APP_NAME')!,
    DB_CONN_STRINGS: parseEnvObject<ConnectionStrings>('DB_CONN_STRINGS'),
    JWT_PUB_KEY: decodeBase64(parseEnvString('JWT_PUB_KEY')!),
    TOTP_SECRET: parseEnvString('TOTP_SECRET')!,
    CONTAINER_NAME: parseEnvString('CONTAINER_NAME'),
    BASE_URLS: parseEnvObject<BaseUrls>('BASE_URLS'),
    SLACK_TOKEN: parseEnvString('SLACK_TOKEN')!,
    CHANNEL_ID: parseEnvString('CHANNEL_ID')!,
    MEILI_CONFIG: parseEnvObject<MeiliConfig>('MEILI_CONFIG'),
    INDEX_MODIFIERS: parseEnvObject('INDEX_MODIFIERS'),
    TXN_TYPE_MAP: parseEnvObject('TXN_TYPE_MAP'),
    BIZ_ACCOUNT_MAP: parseEnvObject('BIZ_ACCOUNT_MAP'),
    VENTOGRAM_ACCOUNT_MAP: parseEnvObject('VENTOGRAM_ACCOUNT_MAP'),
    CURRENCY_MAP: parseEnvObject('CURRENCY_MAP'),
    FORMAT_FIELD_NAMES: parseEnvObject('FORMAT_FIELD_NAMES'),
    BIZ_TXN_MAP: parseEnvObject('BIZ_TXN_MAP'),
    VENTOGRAM_TRANSACTION_MAP: parseEnvObject('VENTOGRAM_TRANSACTION_MAP'),
    FUSION_AUTH_BASE_URL: parseEnvString('FUSION_AUTH_BASE_URL')!,
    FUSION_AUTH_ADMIN_API_KEY: parseEnvString('FUSION_AUTH_ADMIN_API_KEY')!,
    FUSION_AUTH_ADMIN_TENANT_ID: parseEnvString('FUSION_AUTH_ADMIN_TENANT_ID')!,
    FUSION_AUTH_ADMIN_APPLICATION_ID: parseEnvString('FUSION_AUTH_ADMIN_APPLICATION_ID')!,
    FUSION_AUTH_COINPROFILE_API_KEY: parseEnvString('FUSION_AUTH_COINPROFILE_API_KEY')!,
    FUSION_AUTH_COINPROFILE_TENANT_ID: parseEnvString('FUSION_AUTH_COINPROFILE_TENANT_ID')!,
    FUSION_AUTH_COINPROFILE_APPLICATION_ID: parseEnvString(
      'FUSION_AUTH_COINPROFILE_APPLICATION_ID'
    )!,
    BYBIT_CONFIG: parseEnvObject<BybitConfig>('BYBIT_CONFIG')
  };
}

export type Config = ReturnType<typeof getConfig>;
