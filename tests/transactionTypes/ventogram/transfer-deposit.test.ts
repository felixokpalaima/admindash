import { describe, test, expect } from "bun:test";
import { ventogram_db } from "../../db/transactions/ventogram";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactions: [,,,merchantBalanceDepositTransfer]} = ventogram_db
describe("Testing Returned Values for Merchant Balance Transfer", ()=> {

    const shapedMerchantBalanceDepositTransfer = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, merchantBalanceDepositTransfer)

    test('merchantBalanceWithdrawalTransfer transactions should be an object', ()=> {
        expect(shapedMerchantBalanceDepositTransfer.expires).toBe(true)
    })

})


