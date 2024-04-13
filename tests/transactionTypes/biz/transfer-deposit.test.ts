import { describe, test, expect } from "bun:test";
import { biz_db } from "../../db/transactions/biz";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactiondetails: [,,,merchantBalanceDepositTransfer]} = biz_db
describe("Testing Returned Values for Merchant Balance Transfer Deposit", ()=> {

    const shapedMerchantBalanceDepositTransfer = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, merchantBalanceDepositTransfer)

    test('merchantBalanceWithdrawalTransfer transactions should expire', ()=> {
        expect(shapedMerchantBalanceDepositTransfer.expires).toBe(true)
    })
})


