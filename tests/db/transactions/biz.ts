export const biz_db = { //offramp, payout, internalTransfer(transfer), deposit(binance), deposit(ventogram), conversion, withdrawal(crypto), deposit(crypto)
    "transactiondetails": [
        {
          "_id": "6601518ea20507507c91baba", // merchant funding
          "source": 'biz/transactiondetails',
          "currency": "USD",
          "version": "v1.2",
          "transactionId": "e4748fbda0de4ed1be33785d8bb191ae",
          "sender": "door",
          "isFromRegUser": true,
          "prevBalance": 7782.08,
          "senderPrevbalance": 753.88,
          "type": "internalTransfer",
          "status": "fullfiled",
          "businessId": "coinprofileremittance",
          "date": "2024-03-25T10:27:26.008Z",
          "fromCurrency": "USD",
          "fromAmount": 300,
          "amount": 300,
          "username": "ventogram",
          "fee": 0,
          "createdAt": "2024-03-17T10:17:17.433+00:00",
          "updatedAt": "2024-03-17T10:17:17.433+00:00",  
          "__v": 0
        },
        {
          "_id": "65f6c32db82dfd7528501eaf", // crypto withdrawal
          "source": 'biz/transactiondetails',
          "currency": "USD",
          "version": "v1.2",
          "transferId": "02166a71-5e4f-4cdd-b217-88d7709d72b1__chang",
          "memo": "",
          "internalMemo": "Wallet Withdrawal to:0x5ef7bd5279a03d7fc3ee27fc05057d908f2954e2",
          "transactionId": "f02146c2fbde4af1832848b9b1baabd8",
          "sender": "chang",
          "isFromRegUser": true,
          "prevBalance": 522652.04,
          "type": "internalTransfer",
          "status": "fullfiled",
          "businessId": "coinprofileremittance",
          "date": "2024-03-17T10:17:17.190Z",
          "amount": 200,
          "username": "coinprofilewallets",
          "senderPrevbalance": 1293.71,
          "fromAmount": 200.2,
          "fromCurrency": "USD",
          "createdAt": "2024-03-17T10:17:17.433+00:00",
          "updatedAt": "2024-03-17T10:17:17.433+00:00",
          "__v": 0
        },
        {
          "_id": "65e9affed100ba1ac764fa67", // binance pay
          "source": 'biz/transactiondetails',
          "currency": "USD",
          "version": "v1.2",
          "transactionId": "A1HE2DXE8QW71115",
          "sender": "binancepay",
          "username": "chang",
          "isFromRegUser": true,
          "prevBalance": 1698.49,
          "type": "deposit",
          "status": "fullfiled",
          "businessId": "coinprofileremittance",
          "date": "2024-03-07T12:15:58.997Z",
          "amount": 100,
          "internalMemo": "auto conversion: 100 USD",
          "createdAt": "2024-03-07T12:15:58.999+00:00",
          "updatedAt": "2024-03-07T12:15:58.999+00:00",
          "__v": 0
        },
        {
          "_id": "6602d38021c8c97d501bf0c7", // merchant funding - deposit
          "source": 'biz/transactiondetails',
          "currency": "NGN",
          "version": "v1.2",
          "transactionId": "38a8bc1bee8c458baf3ecd86662b3af8",
          "sender": "ventogram",
          "isFromRegUser": true,
          "prevBalance": 0,
          "senderPrevbalance": 4284810.09,
          "type": "internalTransfer",
          "status": "fullfiled",
          "businessId": "coinprofileremittance",
          "date": "2024-03-26T13:54:08.792Z",
          "fromCurrency": "NGN",
          "fromAmount": 100,
          "amount": 100,
          "username": "eltneg",
          "fee": 0,
          "memo": "Ventogram merchant withdraw",
          "createdAt": "2024-03-26T13:54:08.859Z",
          "updatedAt": "2024-03-26T13:54:08.859Z",
          "__v": 0
        },
        {
            "_id": "65fc193ed100baf887693a6b", // offramp
            "source": 'biz/transactiondetails',
            "currency": "NGN",
            "version": "v1.2",
            "transactionId": "0e516e12e8_1462413",
            "sender": "cenoaapp",
            "isFromRegUser": true,
            "prevBalance": 2846156609.12,
            "type": "sent",
            "status": "processing",
            "businessId": "coinprofileremittance",
            "date": "2024-03-21T11:25:50.742Z",
            "paymentId": "c85c60e5618e42cca6f593119dac7c7c",
            "fromCurrency": "USDC",
            "fromAmount": 10.0144,
            "amount": 14624.13,
            "username": "100033::PALMPAY::8109435821::8109435821::NG",
            "fee": 0,
            "transferId": "0e516e12e8",
            "internalMemo": "USDFee:0.1",
            "createdAt": "2024-03-21T11:25:50.744+00:00",
            "updatedAt": "2024-03-21T11:25:50.744+00:00",
            "__v": 0
          },
          {
            "_id":  "65fc09a5d100ba63bb6933d3", // payout
            "source": 'biz/transactiondetails',
            "currency": "NGN",
            "version": "v1.2",
            "transactionId": "763edbb117b443cc940c78ddfbab455d",
            "sender": "omollc",
            "isFromRegUser": true,
            "prevBalance": 0,
            "senderPrevbalance": 8735.06,
            "type": "withdrawal",
            "status": "fullfiled",
            "businessId": "coinprofileremittance",
            "date": "2024-03-21T10:19:16.788Z",
            "fromCurrency": "NGN",
            "fromAmount": 7286.95,
            "amount": 7186.95,
            "username": "044::access bank::0791060371::Emeka Ugwu Ezra",
            "fee": 100,
            "createdAt": "2024-03-21T10:19:17.038+00:00",
            "updatedAt": "2024-03-21T10:19:17.038+00:00",
            "__v": 0
          },
          {
            "_id": "65fc816bd100ba5cc5695d08", // conversion
            "source": 'biz/transactiondetails',
            "currency": "NGN",
            "version": "v1.2",
            "transactionId": "651591cc12bf4ac99d4b9532107bb695",
            "sender": "omollc",
            "isFromRegUser": true,
            "prevBalance": 0,
            "senderPrevbalance": 427.57,
            "type": "conversion",
            "status": "fullfiled",
            "businessId": "coinprofileremittance",
            "date": "2024-03-21T18:50:19.706Z",
            "fromCurrency": "USD",
            "fromAmount": 45.74,
            "amount": 67351.8,
            "username": "omollc",
            "fee": 0,
            "createdAt": "2024-03-21T18:50:19.920+00:00",
            "updatedAt": "2024-03-21T18:50:19.920+00:00",
            "__v": 0
          },
          {
            "_id": "6568e7b9653fe862fb1c4e92", // crypto deposit
            "source": 'biz/transactiondetails',
            "transactionId": "0x8dd98b714184acf99c738cfbbb9c17a09477fc15659478fb1a273082a7ca15c3",
            "__v": 0,
            "amount": 29,
            "businessId": "coinprofileremittance",
            "createdAt": "2023-11-30T19:51:20.780Z",
            "currency": "USD",
            "date": "2023-11-30T19:51:20.780Z",
            "fromAmount": 29,
            "fromCurrency": "USDC",
            "internalMemo": "txhash:0x8dd98b714184acf99c738cfbbb9c17a09477fc15659478fb1a273082a7ca15c3",
            "isFromRegUser": true,
            "network": "polygon",
            "prevBalance": 1755.36,
            "sender": "0x5b2e29caEbe87FC0AC14fEbEa1E15d3a729b3AbA",
            "status": "fullfiled",
            "type": "deposit",
            "updatedAt": "2023-11-30T19:51:20.780Z",
            "username": "chang"
          },
          {
            "_id": "65b6892215251d6a1afab597", // refund
            "source": 'biz/transactiondetails',
            "currency": "USD",
            "version": "v1.2",
            "memo": "refund tx for b4f5d0c9e37b4193a43d9035157dcb9d, failure reason: Error",
            "transactionId": "refund_b4f5d0c9e37b4193a43d9035157dcb9d",
            "isFromRegUser": true,
            "sender": "@refund",
            "prevBalance": 2464.04,
            "type": "deposit",
            "businessId": "coinprofileremittance",
            "date": "2024-01-28T17:04:34.548Z",
            "fromCurrency": "USD",
            "fromAmount": 35.14,
            "amount": 35.14,
            "username": "chang",
            "status": "fullfiled",
            "senderPrevbalance": 0,
            "fee": 0,
            "createdAt": "2024-01-28T17:04:34.548Z",
            "updatedAt": "2024-01-28T17:04:34.548Z",
            "__v": 0
          },
          {
            "_id": "65fbeb35a2050778df91abd4", // voucher deposit
            "source": 'biz/transactiondetails',
            "currency": "NGN",
            "version": "v1.2",
            "internalMemo": "NGN balance funding",
            "isFromRegUser": true,
            "sender": "ventogram",
            "username": "account",
            "paymentId": "3fcf091409a74da89b95b4e4f067bf81",
            "amount": 100000,
            "fromCurrency": "NGN",
            "fromAmount": 100000,
            "type": "deposit",
            "date": "2024-03-21T08:09:25.218Z",
            "transactionId": "809670879033",
            "businessId": "coinprofileremittance",
            "status": "fullfiled",
            "prevBalance": 1100000,
            "createdAt": "2024-03-21T08:09:25.221Z",
            "updatedAt": "2024-03-21T08:09:25.221Z",
            "__v": 0
          }
    ]
  }
  