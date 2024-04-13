type Settings = import('meilisearch').Settings
type DecoratorBase = import("elysia").DecoratorBase
type Context = import("elysia").Context
type Logger = import("pino").Logger;
type DBs = import("../db").DBs;
type ConnectionStrings = import("../db").ConnectionStrings;
type Side = import("./enums").Side;
interface Res<S> {
    statusCode?: number;
    success?: boolean;
    message?: string;
    data?: any;
    error? : any
}
type Controller<R,S> = function(RequestContext, R): Promise< Res<S>>;

interface RequestContext{
    config: Config;
    dbs: DBs;
    log: Logger;
    getLogger: (level: string) => Logger;
}

interface RequestDetails {
    request: Request;
    set: Context['set'];
    params: R | unknown;
    query: R | unknown;
    body: R | unknown;
}

enum Roles {
    superAdmin = 'superadmin',
    customerSuccess = 'customersuccess',
    developer = 'developer',
    manager = 'manager',
    user = 'user'
}

type RolesArray = Array<Roles>

interface HookContext {
    body: any;
    query: Record<string, string | null>;
    params: Record<never, string>;
    headers: Record<string, string | null>;
    cookie: Record<string, Cookie<any>>;
    set: {
        headers: Record<string, string> & {
            'Set-Cookie'?: string | string[]
        };
        status?: number | HTTPStatusName;
        redirect?: string;
        cookie?: Record<string, Prettify<{
            value: string;
        } & CookieOptions>>
    };
    path: string;
    request: Request;
    store: DecoratorBase["store"];
  }

interface GatewayDetails {
    headers: Record<string, string>;
    baseUrl: string;
}

interface RequestData {
    path: string;
    method: string;
    payload?: Record<string, any>;
    timeout?: number;
    otherHeaders?: Record<string, string>
}

interface AuthorizeMerchantBody {
    mfaCode: string;
}


interface ControllerResponse {
    statusCode?: number;
    success?: boolean;
    message?: string;
    data?: any;
    error? : any
}

interface GatewayBaseResponse {
    status?: number;
    message?: string;
    success?: boolean;
    data?: any
}

interface SetRateRequest {
    margin: number;
    type: Side;
}

interface RetryTransactionRequest {
    id: string; 
    service: string; 
    accountNumber: string; 
    account: string; 
    bankCode: string; 
    bankName: string;
}

interface RefreshTransactionRequest {
    businessId: string;
    transactionId: string;
}

interface ManageKycRequest {
    username: string;
    kycLevel: number;
}

interface DefundUserRequest {
    amount: number;
    currency: string;
    reason: string;
    username: string;
}

interface ManageWithdrawalRequest {
    canWithdraw: boolean;
    username: string;
    totp: string;
}

interface GetTransactionsRequest {
    perPage: number;
    page: number;
    username?: string;
    currency?: string;
    status?: string;
    type?: string;
    transactionId?: string;
    query?: string
}

interface GetTransactionRequest {
    perPage: number;
    page: number;
    username?: string;
    email?: string;
}

interface ResetAttemptsReq {
    email: string;
}

interface MFA {
    created: string;
    enrolled: string;
    secret: string;
    otp: string;
}

interface UsersV2 {
    username: string;
    id: string;
    mfa: MFA;
    email: string;
    active: false;
    role: string;
    bio: string;
    lastname: string;
    middlename: string;
    firstname: string;
    fullname: string;
    photo: string;
    profileName: string;
    referrer: string;
    isReferred: boolean;
    isFirstValidReferralValue: boolean;
    createdAt: string;
    updatedAt: string;
    phone: string;
    countryCode: string;
    pubKey: string;
    passcode: string;
}

interface UserTransactionDetail {
    memo: string;
    internalMemo: string;
    transactionId: string;
    isFromRegUser: boolean;
    sender: string;
    prevBalance: number;
    type: string;
    businessId: string;
    date: string;
    paymentId: string;
    fromCurrency: string;
    fromAmount: number;
    currency: string;
    amount: number;
    username: string;
    status: string;
    version: string;
    senderPrevbalance: number;
    fee: number;
    network: string;
    transferId: string;
    failureReason: string;
    recipientAddress: string;
    accountType: string;
    paymentMethod: string;
    threadTs: string;
};
  
interface BalanceV2 {
    username: string;
    amount: number;
    txnCount: number;
    currency: string;
    canWithdraw: boolean;
    totalRecieved: number;
    totalSent: number;
};
  
interface UserAddress {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    houseNumber: string;
};
  
interface Kycs {
    username: string;
    kycLevel: number;
    status: string;
    code: string;
    verificationCountry: string;
    recordId: string;
    verificationMerchant: string;
    otpMerchant: string;
    date: string;
    userAddress: UserAddress,
    idNumber: string;
};

interface BaseResponse {
    success?: boolean,
    message?: string,
    data?: any,
    status?: number
}

type BaseUrls = {
    biz?: string,
    cards?: string,
    waas?: string,
    bend?: string,
    remit?: string,
    ventogram?: string
}

type Services = keyof BaseUrls


type MeiliConfig = {
    host: string,
    apiKey: string
}
type DbName = 'biz' | 'ventogram'

enum NewCollections {
    Transactions = 'Transactions',
}

type FetchAndMergeSettings = {
    remote: Record<string, { uri: string, collections: string[] }>,
    mergeCollections: Record<NewCollections, {mergeThese: {location:string, collection:string}[], mergeShape: {markedFields: string[], resolveUnmarkedFields: Record<string, string>, merger: (shape: any, doc: any) => any}, databaseSettings: Settings}>,
}

type OperationType = 'create' | 'insert' | 'update'
type OperationMap = Record<OperationType, any>

interface VentogramTransactionSchema {
    fromPrevBalance: number;
    toPrevBalance: number;
    toAmount: number;
    toCurrency: string;
    fromAmount: number;
    fromCurrency: string;
    fromAccount: string;
    toAccount: string;
    fee: number;
    rate?: number;
    transactionType: string;
    status: string;
    fromReference?: string;
    toReference?: string;
    txnCount?: number;
    allTxnCount?: number;
    transactionId: string;
    note: string;
    version?: string;
    merchantFee: number;
    voucherFee?: number;
    externalNote?: string;
    voucherFeeCurrency?: string;
  }

interface CreateAPIKey {
    name: string;
    description: string;
    actions: Array<string>;
    indexes: Array<string>;
    expiresAt: Date | null;
}

interface Payouts {
    service: string;
    account?: string;
    currency: string;
    amount: number;
    accountName: string;
    accountNumber: string;
    bankCode: string;
    bankName: string;
    reference: string;
    oldReference: string;
    narration: string;
    clientName: string;
    clientSecret: string;
    note?: string;
    retryCount?: number;
    cancelled?: boolean;
    status: string
    version?: string;
  }

  interface VentogramVoucherSchema {
    id: string,
    email: string,
    amount: number,
    fee: number,
    currency: string,
    feeBearer: string,
    expectedAmount: number,
    fullname: string,
    code: string,
    paymentStatus: string,
    paymentId: string,
    accountNumber: string,
    accountName: string,
    bankCode: string,
    bankName: string,
    paymentExpiresAt: string,
    merchant: string,
    memo: string,
    threadTs: string,
    waivedFee: number,
    accountProvider: string,
    accountType: string,
    version: string,
    createdAt: string,
    updatedAt: string,
  }

  interface PaymentV2 {
    businessId: string;
    senderUsername?: string;
    reference: string;
    incomingAmount: number;
    incomingCurrency: string;
    outgoingAmount: number;
    outgoingCurrency: string;
    confirmedAmount: number;
    unconfirmedAmount: number;
    expTime: string;
    rate: number;
    address?: string;
    customerEmail: string;
    state: string;
    paymentType: string;
    account: string;
    threadTS: string;
    transactions?: {
      [key: string]: boolean;
    };
    outgoingTransactions: {
      [key: string]: string;
    };
    memo?: string;
    resolveId?:string
    internalMemo?: string;
    refundAddress?: string;
  }
interface MeilisearchMaps {
    [key: string]: string;
}

interface CurrencyMap {
    BTC: number,
    ETH: number
}

interface MerchantBalance {
    merchant: string;
    amount: number;
    txnCount: number;
    currency: string;
  }

interface BalancesRecord {
    currency: 'BTC' | 'NGN' | 'USD',
    amount: number
}

interface WaasBalanceRecord {
    currency: 'BTC'
    amount: number
}

interface FusionAuthInviteResponse {
    registration: Record;
    token: string;
    user: Record;
}

interface FusionAuthLoginResponse {
    code: string;
}

interface FusionAuthRegistration {
    roles: string[];
}

interface FusionAuthUser {
    active: boolean;
    email: string;
    id: string;
    registrations: FusionAuthRegistration[];
}

interface FusionAuthSearchUsersResponse {
    total: number;
    users?: FusionAuthUser[];
}

interface FusionAuthGetUserResponse {
    user: {};
}

interface CollectionBalanceTransferData {
    transactionId: string;
    prevBalance: number;
    fromAmount: number;
    fromCurrency: string;
    fromAccount: string;
    fee: number;
    toAccount: string;
    toCurrency: string;
    transactionType: string;
    status: string;
    txnCount: number;
    curBalance: number;
    allTxnCount: number;
    fromReference?: string;
  }

interface CollectionBalanceTransferRes {
    success: boolean;
    message: string;
    data: CollectionBalanceTransferData
}

interface PayoutBalanceTransferData {
    transactionId: string;
    sender: string;
    type: string;
    status: string;
    date: string;
    toCurrency: string;
    fromCurrency: string;
    receiveAmount: number;
    amount: number;
    username: string;
    senderPrevbalance: number
}

interface PayoutBalanceTransferRes {
    success: boolean;
    message: string;
    data: PayoutBalanceTransferData
}

interface sendOTPReqBody {
    purpose: string;
    currency: string;
    amount: string;
    account: string;
    token: string
}

interface MerchantData {
    id: string;
    username: string;
    email: string;
    callbackUrl?: string;
    logo?: string;
    createdAt: string;
    updatedAt: string;
    creditCurrency?: string;
    feeBearer: string;
    endpointId?: string;
    redeemVoucherUrl?: string;
    vipRem?: number;
    slackChannelId?: string
}

type BybitConfig = {
    baseUrl: string,
    p2pPath: string,
}
interface BybitResponse {
    ret_code: number;
    ret_msg: string;
    result: {
      count: number;
      items: Array<{
        price: string;
        [key]: any;
      }>;
    };
    ext_code: string;
    ext_info?: null;
    time_now: string
  }
interface WaasAddress {
    createdAt: string;
    updatedAt: string;
    locked: boolean;
    uid: string;
    appName: string;
    reference: string;
    address: string;
    currency: string;
    balance: string;
    newFormattedBalance: number;
    totalSent: string;
    totalReceived: string;
    index: number;
    expTime: number;
    version: number;
    network: string;
}

type BybitConfig = {
    baseUrl: string,
    p2pPath: string,
}
interface BybitResponse {
    ret_code: number;
    ret_msg: string;
    result: {
      count: number;
      items: Array<{
        price: string;
        [key]: any;
      }>;
    };
    ext_code: string;
    ext_info?: null;
    time_now: string
  }
