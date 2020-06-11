const empowjs = require('empowjs')
import Axios from 'axios';

const EmpowService = {
    networkURL: null,
    apiURL: null,
    empow: null,
    rpc: null,
    address: null,
    privateKey: null,
    wallet: null,

    init(options) {
        this.networkURL = options.networkURL
        this.apiURL = options.apiURL
        this.rpc = new empowjs.RPC(new empowjs.HTTPProvider(options.networkURL))
    },

    createNewWallet() {
        this.wallet = empowjs.Wallet.create()
        this.privateKey = this.wallet.privateKey
        return this.privateKey
    },

    restoreWallet(privateKey) {
        const privateKeyBuffer = empowjs.Base58.decode(privateKey)
        this.wallet = new empowjs.Wallet(privateKeyBuffer)
        this.privateKey = privateKey
        return this.wallet
    },

    async getRamPrice() {
        return Axios.get(`${this.networkURL}/getRAMInfo`)
    },

    async buyRam(amount) {
        try {
            const tx = await this.empow.callABI("ram.empow", "buy", [this.address, this.address, parseFloat(amount)])
            const res = await this.sendAction(tx, 'success')
            return {
                success: true,
                txid: res
            }
        } catch (error) {
            return {
                error: error.message ? error.message : error
            }
        }
    },

    async sellRam(amount) {
        try {
            const tx = await this.empow.callABI("ram.empow", "sell", [this.address, this.address, parseFloat(amount)])
            const res = await this.sendAction(tx, 'success')
            return {
                success: true,
                txid: res
            }
        } catch (error) {
            return {
                error: error.message ? error.message : error
            }
        }
    },

    async pledge(amount) {
        amount = parseFloat(amount);
        try {
            const tx = await this.empow.callABI("gas.empow", "pledge", [this.address, this.address, amount.toFixed(2)])
            const res = await this.sendAction(tx, 'success')
            return {
                success: true,
                txid: res.tx_hash
            }
        } catch (error) {
            return {
                error: error.message ? error.message : error
            }
        }
    },

    async unpledge(amount) {
        amount = parseFloat(amount);
        try {
            const tx = await this.empow.callABI("gas.empow", "unpledge", [this.address, this.address, amount.toFixed(2)])
            const res = await this.sendAction(tx, 'success')
            return {
                success: true,
                txid: res.tx_hash
            }
        } catch (error) {
            return {
                error: error.message ? error.message : error
            }
        }
    },

    async getBalanceAndUsername(address) {
        try {
            const result = await this.rpc.blockchain.getAccountInfo(address)
            const username = await this.rpc.blockchain.getContractStorage("auth.empow", `s_${address}`, "", true)
            return {
                balance: result.balance,
                username: username.data === 'null' ? null : username.data
            }
        } catch (err) {
            return {
                balance: 0,
                username: null
            }
        }
    },

    async getAccountInfo() {
        const ram = await this.getRamPrice()

        try {
            const result = await this.rpc.blockchain.getAccountInfo(this.address)
            const username = await this.rpc.blockchain.getContractStorage("auth.empow", `s_${this.address}`, "", true)
            var maxUnpledge = 0;
            for (let i = 0; i < result.gas_info.pledged_info.length; i++) {
                if (result.gas_info.pledged_info[i].pledger === this.address) {
                    maxUnpledge += result.gas_info.pledged_info[i].amount;
                }
            }
            return {
                balance: result.balance,
                gasLimit: result.gas_info.limit,
                gasUsed: result.gas_info.limit - result.gas_info.current_total,
                ramLimit: result.ram_info.total,
                ramUsed: result.ram_info.used,
                ramPrice: ram.data.buy_price,
                maxUnpledge,
                username: username.data === 'null' ? null : username.data
            }
        } catch (err) {
            return {
                balance: 0,
                gasLimit: 1,
                gasUsed: 1,
                ramLimit: 1,
                ramUsed: 1,
                ramPrice: ram.data.buy_price,
                maxUnpledge: 0,
                username: null
            }
        }
    },

    updatePrivateKey(privateKey) {
        const privateKeyBuffer = empowjs.Base58.decode(privateKey)
        const wallet = new empowjs.Wallet(privateKeyBuffer)

        this.privateKey = privateKey
        this.address = wallet.address

        this.empow = new empowjs.EMPOW(this.rpc, wallet, {
            gasRatio: 1,
            gasLimit: 1000000
        })
    },

    sendAction(tx, status = 'pending') {
        return new Promise(async (resolve, reject) => {
            // assign prototype
            let tempTx = this.empow.callABI(tx.actions[0].contract, tx.actions[0].actionName, JSON.parse(tx.actions[0].data))
            if (tx.amount_limit) tempTx.amount_limit = tx.amount_limit
            if (tx.gasLimit) tempTx.gasLimit = tx.gasLimit
            if (tx.gasRatio) tempTx.gasRatio = tx.gasRatio

            if(!tempTx.amount_limit || tempTx.amount_limit.length === 0) {
                tempTx.addApprove("*", "unlimited")
            }

            let handler = this.empow.signAndSend(tempTx)

            if (status === 'success') {
                handler.on('success', res => {
                    resolve(res)
                })
            } else {
                handler.on('pending', res => {
                    console.log(res);
                    resolve(res)
                })
            }

            handler.on('failed', res => {
                reject(res)
            })
        })
    },

    async send(to, value, memo) {
        try {
            const tx = await this.empow.callABI("token.empow", "transfer", ["em", this.address, to, value, memo])
            const res = await this.sendAction(tx, 'success')
            return {
                success: true,
                txid: res.tx_hash
            }
        } catch (error) {
            return {
                error: error.message ? error.message : error
            }
        }
    },

    getTransactionHistories(address) {

        return new Promise(async (resolve, reject) => {
            try {
                const res = await Axios.get(`${this.apiURL}/getAddressTransfer/${address}`)
                const txnList = res.data
                let result = []
                let count = 0;

                for (var i = 0; i < txnList.length; i++) {
                    const temp = txnList[i]
                    var data = temp.actions[0].data
                    result[count] = {}
                    result[count].type = data[1] == address ? 'send' : 'receive'
                    result[count].value = parseFloat(data[3])
                    result[count].address = data[1] == address ? data[2] : data[1]
                    result[count].time = new Date(temp.time / 10 ** 6).getTime() / 1000
                    result[count].txid = temp.hash
                    count++
                }

                resolve(result)
            } catch (error) {
                resolve([])
            }
        })
    },

    getAddressByUsername(username) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await Axios.get(`${this.apiURL}/getAddressByUsername/${username}`)
                resolve(res.data)
            } catch (error) {
                resolve(error.response.data)
            }
        })
    },
}

export default EmpowService