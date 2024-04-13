import { describe, test, expect } from "bun:test";
import { biz_db } from "../../db/transactions/biz";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactiondetails: [,,,,,,,,,voucherDeposit]} = biz_db
describe("Testing Returned Values for Voucher Deposit", ()=> {

    const shapedVoucherDeposit = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, voucherDeposit)
    const voucherDepositTxn = renameTransactionFields(shapedVoucherDeposit, 'account')

    test('voucherDepositTxn transactions should be an object', ()=> {
        expect(voucherDepositTxn).toBeDefined
        expect(voucherDepositTxn).toBeTypeOf('object')
    })

    test('voucherDepositTxn transactions should have prevBalance and currentBalance Properties', ()=> {
        expect(voucherDepositTxn).toHaveProperty('prevBalance')
        expect(voucherDepositTxn).toHaveProperty('currentBalance')
    })

    test('voucherDepositTxn transactions should have prevBalance and currentBalance properties defined', ()=> {
        expect(voucherDepositTxn.prevBalance).toBeDefined
        expect(voucherDepositTxn.currentBalance).toBeDefined
    })

    test('voucherDepositTxn transactions should have currentBalance increased and fee', ()=> {
        expect(voucherDepositTxn.prevBalance).toBe('NGN 1,100,000.00')
        expect(voucherDepositTxn.currentBalance).toBe('NGN 1,200,000.00')
        expect(voucherDepositTxn.fee).toBe('0.00')
        expect(voucherDepositTxn.feeCurrency).toBe('NGN')
    })

})
