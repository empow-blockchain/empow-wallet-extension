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
    getAllAccountInfo () {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'getAllAccountInfo', null, resolve, reject)
        ))
    },
    getSelectedCoin () {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'getSelectedCoin', null, resolve, reject)
        ))
    },
    setSelectedCoin (index) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'setSelectedCoin', index, resolve, reject)
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
    createIostAccount (payment, name) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'createIostAccount', {payment, name}, resolve, reject)
        ))
    },

    toggleLeftPanel () {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'toggleLeftPanel', null, resolve, reject)
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
    },
    getLeftPanelState() {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'getLeftPanelState', null, resolve, reject)
        ))
    },
    setLeftPanelState (leftPanelState) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'setLeftPanelState', leftPanelState, resolve, reject)
        ))
    },
    register (email,password) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'register', {email,password}, resolve, reject)
        ))
    },
    login(email, password){
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'login', { email,password }, resolve, reject)
        ))
    },
    logout() {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'logout', null, resolve, reject)
        )) 
    },
    forgot (email) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'forgot', email, resolve, reject)
        )) 
    },
    leftChangePassword (oldPassword, newPassword) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'leftChangePassword', {oldPassword, newPassword}, resolve, reject)
        )) 
    },
    getLeftAccountInfo () {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'getLeftAccountInfo', null, resolve, reject)
        )) 
    },
    spin (type) {
        return new Promise((resolve,reject) => (
            this.handle.send('Request', 'spin', type, resolve, reject)
        ))
    },
}

export default PopupAPI