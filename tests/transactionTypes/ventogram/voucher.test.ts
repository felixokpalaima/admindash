import { describe, test, expect } from "bun:test";
import { ventogram_db } from "../../db/transactions/ventogram";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactions: [,voucherTransaction]} = ventogram_db
describe("Testing Returned Values for Offramp", ()=> {

    const shapedVoucherTxn = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, voucherTransaction)
    const voucherTxn = renameTransactionFields(shapedVoucherTxn, 'coinprofile')

    test('voucher transactions should be an object', ()=> {
        expect(voucherTxn).toBeDefined
        expect(voucherTxn).toBeTypeOf('object')
    })

    test('voucher transactions should have prevBalance and currentBalance Properties', ()=> {
        expect(voucherTxn).toHaveProperty('prevBalance')
        expect(voucherTxn).toHaveProperty('currentBalance')
    })

    test('voucher transactions should have prevBalance and currentBalance properties defined', ()=> {
        expect(voucherTxn.prevBalance).toBeDefined
        expect(voucherTxn.currentBalance).toBeDefined

    })

    test('voucher transactions should currentBalance increased, prevBalance divided by 100 and fee', ()=> {
        expect(voucherTxn.prevBalance).toBe('USD 221,804.81')
        expect(voucherTxn.currentBalance).toBe('USD 221,836.87')
        expect(voucherTxn.fee).toBe('1000.00')
        expect(voucherTxn.feeCurrency).toBe('NGN')
    })

    test('voucher transactions should have sender and receiver (username) fields', ()=> {
        expect(voucherTxn.sender).toBe(voucherTxn.username)
    })


})


