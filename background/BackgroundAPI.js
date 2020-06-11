import EventEmitter from 'eventemitter3'
import StorageService from './services/StorageService'
import WalletService from './services/WalletService'
import { APP_STATE } from '../constants';
import EmpowService from './services/EmpowService';

class BackgroundAPI extends EventEmitter {

    constructor() {
        super()

        WalletService.init()
        this.checkAutoLock()
    }

    checkAutoLock() {
        let interaval = setInterval(() => {

            if (!StorageService.ready) clearInterval(interaval)

            const now = new Date().getTime()
            if (WalletService.lastRequestTime != 0 && StorageService.setting.autolock != 0 && now - WalletService.lastRequestTime >= StorageService.setting.autolock) {
                console.log("AUTO LOCK");
                this.lock()
            }
        }, 60 * 1000)
    }

    onTabRequest(req) {
        let uuid = req.uuid
        let messageUUID = req.messageUUID
        let event = req.event
        let data = req.data

        this[event](uuid, messageUUID, data)
    }

    onPopupRequest(req) {
        let messageUUID = req.messageUUID
        let event = req.event
        let data = req.data

        this[event](messageUUID, data)
    }

    onPopupConnect() {
        if (!StorageService.ready || !StorageService.accounts) return;

        // start pool
        WalletService.startPool((index) => {
            this.popupUpdate('updateAccountInfo', {
                index,
                accountInfo: WalletService.accountInfo[index]
            })
        })
    }

    onPopupDisconnect() {
        WalletService.stopPool()
    }

    tabResponse(uuid, messageUUID, data) {
        this.emit('newTabResponse', {
            uuid,
            messageUUID,
            data
        })
    }

    tabUpdate(event, data) {
        this.emit('newTabUpdate', {
            event,
            data
        })
    }

    popupResponse(messageUUID, data) {
        this.emit('newPopupResponse', {
            messageUUID,
            data
        })
    }

    popupUpdate(event, data) {
        this.emit('newPopupUpdate', {
            event,
            data
        })
    }

    // TAB REQUEST
    getNetwork(uuid, messageUUID) {
        this.tabResponse(uuid, messageUUID, WalletService.getNetwork())
    }

    getWalletInfo(uuid, messageUUID) {
        this.tabResponse(uuid, messageUUID, WalletService.getAddress())
    }

    connectEmpowWallet(uuid, messageUUID) {
        if (!StorageService.ready) {
            WalletService.openPopup()

            return this.connectQueue = {
                type: 'empow',
                uuid,
                messageUUID
            }
        }

        this.tabResponse(uuid, messageUUID, StorageService.selectedAccount.address)
    }

    empowSendTransaction(uuid, messageUUID, transaction) {
        WalletService.empowTransaction(uuid, messageUUID, transaction, () => {
            this.popupUpdate('updateAppState', APP_STATE.SIGN_TRANSACTION)
        }, (uuid, messageUUID, result) => {
            this.tabResponse(uuid, messageUUID, result)
        })
    }

    // POPUP REQUEST
    async getAppState(messageUUID) {
        const appState = await WalletService.getAppState()
        this.popupResponse(messageUUID, appState)
    }

    getSelectedCoin(messageUUID) {
        this.popupResponse(messageUUID, WalletService.selectedCoinIndex)
    }

    setAppState(messageUUID, appState) {
        this.popupUpdate('updateAppState', appState)
    }

    getSetting(messageUUID) {
        this.popupResponse(messageUUID, StorageService.setting)
    }

    setSetting(messageUUID, data) {
        StorageService.setting[data.property] = data.data
        StorageService.saveSetting()

        if (data.property == 'networks') {
            WalletService.changeNetwork(data.data, async () => {
                this.popupUpdate('updateAppState', await WalletService.getAppState())
            })
        }

        this.popupUpdate('updateSetting', StorageService.setting)
    }

    addNetwork(messageUUID, network) {
        for (let i = 0; i < StorageService.setting.networks.length; i++) {
            StorageService.setting.networks[i].selected = false
        }
        StorageService.setting.networks.push(network)
        StorageService.saveSetting()
        WalletService.changeNetwork(network, async () => {
            this.popupUpdate('updateAppState', await WalletService.getAppState())
        })
    }

    deleteNetwork(messageUUID, url) {
        StorageService.setting.networks = StorageService.setting.networks.filter(x => x.url !== url)
        if (!StorageService.setting.networks.find(x => x.selected === true)) {
            StorageService.setting.networks[0].selected = true
        }
        StorageService.saveSetting()
        WalletService.changeNetwork(url, async () => {
            this.popupUpdate('updateAppState', await WalletService.getAppState())
        })
    }

    getSelectedAccount(messageUUID) {
        this.popupResponse(messageUUID, StorageService.selectedAccount)
    }

    setSelectedAccount(messageUUID, address) {
        var account = StorageService.accounts.find(x => x.address === address)
        StorageService.selectedAccount = account
        StorageService.saveSelectedAccount()
        EmpowService.updatePrivateKey(account.privateKey)
        WalletService.getSelectedAccountInfo( () => {
            this.popupUpdate('updateSelectedAccount', account)
        })
    }

    async getTransactionHistories(messageUUID, address) {
        this.popupResponse(messageUUID, await WalletService.getTransactionHistories(address))
    }

    async getAddressByUsername(messageUUID, username) {
        this.popupResponse(messageUUID, await WalletService.getAddressByUsername(username))
    }

    getTransactionQueue(messageUUID) {
        if (!WalletService.transactionQueue) {
            this.popupResponse(messageUUID, null)
        } else {
            this.popupResponse(messageUUID, WalletService.transactionQueue.transaction)
        }
    }

    async setPassword(messageUUID, password) {
        if (await StorageService.dataExists()) this.popupResponse(messageUUID, { error: 'App already has password. You can\'t set password again' })
        StorageService.init(password)
        this.popupResponse(messageUUID, { success: true })
        this.popupUpdate('updateAppState', await WalletService.getAppState())
    }

    async updateAfterUnlock(messageUUID) {
        // set network
        WalletService.init()
        // update network
        this.tabUpdate('updateNetwork', WalletService.getNetwork())

        this.popupUpdate('updateAppState', await WalletService.getAppState())
        this.popupUpdate('updateSetting', StorageService.setting)
        this.popupUpdate('updateAccounts', StorageService.accounts)
        this.popupResponse(messageUUID, { success: true })
        this.tabUpdate('updateAddress', WalletService.getAddress())

        // solve connect queue
        if (WalletService.popup) WalletService.closePopup()
        if (this.connectQueue) {
            if (this.connectQueue.type == 'empow') {
                this.tabResponse(this.connectQueue.uuid, this.connectQueue.messageUUID, StorageService.selectedAccount.address)
            }

            this.connectQueue = null
        }

        // update address for all blockchain services
        await WalletService.updateServiceAddress()

        // start pool
        WalletService.startPool(() => {
            this.popupUpdate('updateSelectedAccount', StorageService.selectedAccount)
            this.popupUpdate('updateAccounts', StorageService.accounts)
        })

        // update time to autolock
        WalletService.lastOpenPopupTime = new Date().getTime()
    }

    unlock(messageUUID, password) {
        StorageService.unlock(password).then(async () => {
            this.updateAfterUnlock(messageUUID)
        }).catch(error => {
            this.popupResponse(messageUUID, {
                error
            })
        })
    }

    async lock(messageUUID) {
        WalletService.lock()
        this.popupUpdate('updateAppState', await WalletService.getAppState())
    }

    async createNewWallet(messageUUID) {
        this.popupResponse(messageUUID, { privateKey: WalletService.createNewWallet() })
    }

    async restoreWallet(messageUUID, privateKey) {
        try {
            await WalletService.restoreWallet(privateKey)
            this.updateAfterUnlock(messageUUID)
        } catch (error) {
            if (typeof error == 'object') error = error.message
            this.popupResponse(messageUUID, {
                error
            })
        }
    }

    async getAccounts(messageUUID) {
        this.popupResponse(messageUUID,
            StorageService.accounts
        )
    }

    async setAccounts(messageUUID, accounts) {
        if (!accounts.find(x => x.address === StorageService.selectedAccount.address)) {
            StorageService.selectedAccount = accounts[0]
            StorageService.saveSelectedAccount()
            EmpowService.updatePrivateKey(accounts[0].privateKey)
            this.popupUpdate('updateSelectedAccount', accounts[0])
        }

        WalletService.setAccounts(accounts)
        this.popupUpdate('updateAccounts', accounts)
    }

    async send(messageUUID, data) {
        const result = await WalletService.send(data)

        if (result.error) {
            this.popupResponse(messageUUID, {
                error: result.error
            })
        } else {
            this.popupResponse(messageUUID, result)
        }
    }

    // addToken(messageUUID, data) {
    //     try {
    //         WalletService.addToken(data)
    //         this.popupResponse(messageUUID, {success: true})
    //     } catch (error) {

    //         this.popupResponse(messageUUID, {
    //             error: error.message ? error.message : error
    //         })
    //     }
    // }

    checkPassword(messageUUID, password) {
        if (StorageService.password != password) {
            this.popupResponse(messageUUID, {
                error: 'Password not correct'
            })
        } else {
            this.popupResponse(messageUUID, { success: true })
        }
    }

    changePassword(messageUUID, password) {
        StorageService.password = password
        StorageService.saveAll()
        this.lock()
    }

    async buyRamEM(messageUUID, bytes) {
        try {
            var data = await WalletService.buyRamEM(bytes)
            this.popupResponse(messageUUID, data)
        } catch (error) {
            this.popupResponse(messageUUID, {
                error: error.message ? error.message : error
            })
        }
    }

    async sellRamEM(messageUUID, bytes) {
        try {
            var data = await WalletService.sellRamEM(bytes)
            this.popupResponse(messageUUID, data)
        } catch (error) {
            this.popupResponse(messageUUID, {
                error: error.message ? error.message : error
            })
        }
    }

    async pledge(messageUUID, amount) {
        try {
            var data = await WalletService.pledge(amount)
            this.popupResponse(messageUUID, data)
        } catch (error) {
            this.popupResponse(messageUUID, {
                error: error.message ? error.message : error
            })
        }
    }

    async unpledge(messageUUID, amount) {
        try {
            var data = await WalletService.unpledge(amount)
            this.popupResponse(messageUUID, data)
        } catch (error) {
            this.popupResponse(messageUUID, {
                error: error.message ? error.message : error
            })
        }
    }

    async acceptTransaction(messageUUID, timeExpired) {

        if (timeExpired && timeExpired != 0) {
            StorageService.addWhitelist(WalletService.transactionQueue.transaction.contractAddress, timeExpired)
        }

        WalletService.acceptTransaction()
    }

    rejectTransaction() {
        WalletService.rejectTransaction(async (uuid, messageUUID) => {
            this.tabResponse(uuid, messageUUID, {
                error: 'Transaction reject by user'
            })
            this.popupUpdate('updateAppState', await WalletService.getAppState())
        })
    }

}

export default BackgroundAPI