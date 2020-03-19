import extensionizer from 'extensionizer'
import StorageService from './StorageService'
import { APP_STATE, NODE } from './../../constants/index'
import EmpowService from './EmpowService'

const WalletService = {
    popup: false,
    appState: APP_STATE.UNINITIALISED,
    transactionQueue: null,
    pool: false,
    accountInfo: [],
    selectedCoinIndex: false,
    lastRequestTime: 0,
    updateBalanceCallback: false,

    init() {
        // update network setting for old users
        if (StorageService.ready) {
            const { networks } = StorageService.setting

            for (let i = 0; i < networks.length; i++) {
                if (networks[i].selected) {
                    EmpowService.init({
                        networkURL: networks[i].url,
                        apiURL: NODE.MAINNET.API_URL
                    })

                    return
                }
            }
        }
    },

    createNewWallet() {
        return EmpowService.createNewWallet()
    },

    getNetwork() {
        return {
            networkURL: EmpowService.networkURL
        }
    },

    getAddress() {
        if (!StorageService.ready || !StorageService.selectedAccount) return []
        return StorageService.selectedAccount.address
    },

    async getAppState() {

        if (await StorageService.dataExists()) this.appState = APP_STATE.PASSWORD_SET

        if (StorageService.ready) {
            this.appState = APP_STATE.UNLOCKED

            if (StorageService.selectedAccount) {
                this.appState = APP_STATE.READY
            }
        }

        if (this.transactionQueue) this.appState = APP_STATE.SIGN_TRANSACTION

        console.log(this.appState)

        return this.appState
    },

    restoreWallet(privateKey) {
        var exist = StorageService.accounts.find(x => x.privateKey === privateKey)
        if (exist) {
            StorageService.saveSelectedAccount(exist)
            return
        }

        const wallet = EmpowService.restoreWallet(privateKey)
        StorageService.saveAccount({ address: wallet.address, publicKey: wallet.publicKey, privateKey: wallet.privateKey, balance: 0 })
        StorageService.saveSelectedAccount({ address: wallet.address, publicKey: wallet.publicKey, privateKey: wallet.privateKey, balance: 0 })
    },

    async updateServiceAddress() {
        const accounts = StorageService.selectedAccount
        EmpowService.updatePrivateKey(accounts.privateKey)
    },

    getTransactionHistories(accountInfo) {
        const coinName = accountInfo.name.toLowerCase()
        if (coinName == 'empow') {
            return EmpowService.getTransactionHistories()
        }
        return []
    },

    async getAccountInfo(callback) {
        var accounts = StorageService.accounts || []
        for (let i = 0; i < accounts.length; i++) {
            const info = await EmpowService.getBalanceAndUsername(accounts[i].address)
            StorageService.accounts[i].balance = info.balance;
            StorageService.accounts[i].username = info.username;
        }

        const data = await EmpowService.getAccountInfo()
        StorageService.selectedAccount = Object.assign(StorageService.selectedAccount, data)

        console.log("abc")

        callback()
    },

    setAccounts (accounts) {
        console.log("1")
        if (!accounts.find(x => x.address === StorageService.selectedAccount.address)) {
            StorageService.selectedAccount = accounts[0]
            
        }
        StorageService.accounts = accounts
        StorageService.saveAccounts()

        this.getAccountInfo(this.updateBalanceCallback)
    },

    startPool(callback) {
        this.updateBalanceCallback = callback
        console.log("START POOLING")

        this.getAccountInfo(callback)

        this.pool = setInterval(() => {
            this.lastOpenPopupTime = new Date().getTime()
            this.getAccountInfo(callback)
        }, 10000)
    },

    stopPool() {
        console.log("STOP POOLING")
        clearInterval(this.pool)
    },

    send(data) {
        const { coinInfo, to, value, memo } = data
        if (coinInfo.name.toLowerCase() == 'empow') {
            return EmpowService.send(to, value, memo)
        }
    },

    lock() {
        this.lastOpenPopupTime = 0
        StorageService.ready = false
        StorageService.password = ''
    },

    changeNetwork(network, callback) {
        this.lock()
        callback()
    },

    // addToken(data) {
    //     const { type, contractAddress, name, symbol, decimal, defaultValue } = data
    //     const { tokens } = StorageService

    //     if (type == 'ERC20' && !EthereumService.isAddress(contractAddress)) throw new Error('Contract Address is not ERC20 Token')
    //     if (type == 'TRC20' && !TronService.isAddress(contractAddress)) throw new Error('Contract Address is not TRC20 Token')
    //     if (type == 'EOSTOKEN' && contractAddress.length != 12) throw new Error('Contract Address is not EOS Token')

    //     for (var i = 0; i < tokens.length; i++) {
    //         if (tokens[i].contractAddress == contractAddress) {
    //             throw new Error('This token is exist')
    //         }
    //     }

    //     StorageService.tokens.unshift({
    //         type,
    //         contractAddress,
    //         name,
    //         symbol,
    //         decimal,
    //         customToken: true
    //     })

    //     StorageService.saveTokens()

    //     this.stopPool()
    //     this.startPool(this.updateBalanceCallback)
    // },

    buyRamEM(bytes) {
        return EmpowService.buyRam(bytes)
    },

    sellRamEM(bytes) {
        return EmpowService.sellRam(bytes)
    },


    pledge(amount) {
        return EmpowService.pledge(amount)
    },

    unpledge(amount) {
        return EmpowService.unpledge(amount)
    },

    empowTransaction(uuid, messageUUID, transaction, callback, acceptCallback) {
        if (!StorageService.ready) return callback({ error: 'You need unlock wallet first' })

        this.transactionQueue = {
            uuid,
            messageUUID,
            rawTransaction: transaction,
            transaction: {
                type: 'send',
                coin: 'empow',
                contractAddress: transaction.actions[0].contract + " > " + transaction.actions[0].actionName,
                amount: transaction.amount_limit[0].value,
                symbol: transaction.amount_limit[0].token.toUpperCase(),
                json: transaction.actions[0].data
            },
            acceptCallback
        }

        if (this.transactionQueue.transaction && this.transactionQueue.transaction.contractAddress && StorageService.checkWhitelist(this.transactionQueue.transaction.contractAddress)) {
            this.acceptTransaction()
            return;
        }

        this.openPopup()
        callback()
    },

    async acceptTransaction() {
        if (this.popup) this.closePopup()

        let { uuid, messageUUID, rawTransaction, transaction, acceptCallback } = this.transactionQueue

        let result = null

        if (transaction.coin == 'empow') {
            try {
                result = await EmpowService.sendAction(rawTransaction)
                acceptCallback(uuid, messageUUID, result)
            } catch (err) {
                acceptCallback(uuid, messageUUID, {
                    error: err.message
                })
            }
        }

        this.transactionQueue = null
    },

    rejectTransaction(callback) {
        this.closePopup()
        callback(this.transactionQueue.uuid, this.transactionQueue.messageUUID)
        this.transactionQueue = null
    },

    async closePopup() {
        if (this.popup == false) return

        extensionizer.windows.remove(this.popup.id)
        this.popup = false
    },

    async openPopup() {

        if (this.popup != false)
            this.closePopup()

        this.popup = await extensionizer.windows.create({
            url: 'popup.html',
            type: 'popup',
            width: 365,
            height: 600,
            left: 25,
            top: 25
        }, res => {
            this.popup = res
        })
    }
}

export default WalletService