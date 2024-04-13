import { describe, test, expect } from "bun:test";
import { biz_db } from "../../db/transactions/biz";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactiondetails: [,cryptoWithdrawal]} = biz_db
describe("Testing Returned Values for Crypto Withdrawal", ()=> {

    const shapedCryptoWithdrawal = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, cryptoWithdrawal)
    const cryptoWithdrawalTxn = renameTransactionFields(shapedCryptoWithdrawal, 'chang')
    const walletAddress = cryptoWithdrawal.internalMemo?.split(':')[1]

    test('cryptoWithdrawalTxn transactions should be an object', ()=> {
        expect(cryptoWithdrawalTxn).toBeDefined
        expect(cryptoWithdrawalTxn).toBeTypeOf('object')
    })

    test('cryptoWithdrawalTxn transactions should have prevBalance and currentBalance Properties', ()=> {
        expect(cryptoWithdrawalTxn).toHaveProperty('prevBalance')
        expect(cryptoWithdrawalTxn).toHaveProperty('currentBalance')
    })

    test('cryptoWithdrawalTxn transactions should have prevBalance and currentBalance properties defined', ()=> {
        expect(cryptoWithdrawalTxn.prevBalance).toBeDefined
        expect(cryptoWithdrawalTxn.currentBalance).toBeDefined
    })

    test('cryptoWithdrawalTxn transactions should have currentBalance decreased and fee', ()=> {
        expect(cryptoWithdrawalTxn.prevBalance).toBe('USD 1,293.71')
        expect(cryptoWithdrawalTxn.currentBalance).toBe('USD 1,093.71')
        expect(cryptoWithdrawalTxn.fee).toBe(0)
        expect(cryptoWithdrawalTxn.feeCurrency).toBe('USD')
    })

    test('cryptoWithdrawalTxn transactions should have username and receiverWallet', ()=> {
        expect(cryptoWithdrawalTxn.username).toBe(walletAddress)
        expect(cryptoWithdrawalTxn.receiverWallet).toBe(walletAddress)
    })
})
