import requestHandle from './../../lib/requestHandle'

const PopupAPI = {
    init (connection) {
        this.handle = new requestHandle(connection)
    },
    getAppState() {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'getAppState', null, resolve, reject)
        ))
    },
    setAppState(appState) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'setAppState', appState, resolve, reject)
        ))
    },
    unlock(password) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'unlock', password, resolve, reject)
        ))
    },
    lock () {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'lock', null, resolve, reject)
        ))
    },
    createNewWallet () {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'createNewWallet', null, resolve, reject)
        ))
    },
    restoreWallet (privateKey) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'restoreWallet', privateKey, resolve, reject)
        ))
    },
    getAccounts () {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'getAccounts', null, resolve, reject)
        ))
    },
    setAccounts (accounts) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'setAccounts', accounts, resolve, reject)
        ))
    },
    getSelectedAccount () {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'getSelectedAccount', null, resolve, reject)
        ))
    },
    setSelectedAccount (address) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'setSelectedAccount', address, resolve, reject)
        ))
    },
    
    getTransactionHistories (coinName) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'getTransactionHistories', coinName, resolve, reject)
        ))
    },
    getTransactionQueue() {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'getTransactionQueue', null, resolve, reject)
        ))
    },
    setPassword(password) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'setPassword', password, resolve, reject)
        ))
    },
    send (coinInfo, to, value, memo) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'send', { coinInfo,to,value,memo }, resolve, reject)
        ))
    },
    getSetting () {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'getSetting', null, resolve, reject)
        ))
    },
    setSetting(property, data) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'setSetting', {property, data}, resolve, reject)
        ))
    },
    addNetwork(network) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'addNetwork', network, resolve, reject)
        ))
    },
    // addToken (type, contractAddress, name, symbol, decimal) {
    //     return new Promise((resolve,reject) => (
    //         this.handle.send('Request', 'addToken', {type, contractAddress, name, symbol, decimal}, resolve, reject)
    //     ))
    // },
    checkPassword (password) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'checkPassword', password, resolve, reject)
        ))
    },
    changePassword (password) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'changePassword', password, resolve, reject)
        ))
    },
    buyRamEM (bytes) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'buyRamEM', bytes, resolve, reject)
        ))
    },
    sellRamEM (bytes) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'sellRamEM', bytes, resolve, reject)
        ))
    },
    pledge (amount) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'pledge', amount, resolve, reject)
        ))
    },
    unpledge (amount) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'unpledge', amount, resolve, reject)
        ))
    },
    acceptTransaction(timeExpired) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'acceptTransaction', timeExpired, resolve, reject)
        ))
    },
    rejectTransaction() {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'rejectTransaction', null, resolve, reject)
        ))
    }
}

export default PopupAPI