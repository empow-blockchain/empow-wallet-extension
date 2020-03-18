import Axios from 'axios'

class Callback {
    constructor() {
        this.map = {}
    }

    on(msg, f) {
        this.map[msg] = f;
        return this;
    }

    pushMsg(msg, args) {
        const f = this.map[msg];
        if (f === undefined) {
            return
        }
        f(args)
    }
}

const iost = {
    request: null,
    IWalletJS: {},
    DEFAULT_IOST_CONFIG: {
        gasRatio: 1,
        gasLimit: 100000,
        delay:0,
    },
    networkURL: null,
    address: null,
    rpc: null,

    init(request) {
        this.request = request
        this.IWalletJS.newIOST = (IOST) => this.newIOST(IOST)
        this.IWalletJS.enable = () => this.enable()
        this.IWalletJS.setAccount = (network) => this.setAccount({networkURL})
        this.save()
    },

    sendTransaction(transaction) {
        return new Promise((resolve, reject) => {
            this.request.send('Request', 'iostSendTransaction', transaction, resolve, reject)
        })
    },

    signAndSend(transaction) {
        var _this = this;
        const handle = new Callback()

        this.sendTransaction(transaction).then(res => {
            handle.pushMsg("pending", res)

            let interval = setInterval( () => {
                Axios.get(`${this.networkURL}/getTxByHash/${res}`).then(res2 => {
                    const temp = res2.data
                    if(temp.transaction.tx_receipt.status_code != 'SUCCESS') {
                        handle.pushMsg("failed", new Error(temp.transaction.tx_receipt.message))
                    } else {
                        handle.pushMsg("success", temp)
                    }

                    clearInterval(interval)
                })
            },1000)

        }).catch(error => {
            handle.pushMsg("failed", error)
        })

        return handle
    },

    enable() {
        return new Promise((resolve, reject) => {
            this.request.send('Request', 'connectIostWallet', null, resolve, reject)
        })
    },

    newIOST(IOST) {
        this.rpc = new IOST.RPC(new IOST.HTTPProvider(this.networkURL))
        this.IWalletJS.rpc = this.rpc
        this.IWalletJS.pack = IOST
        this.IWalletJS.iost = new IOST.IOST(this.DEFAULT_IOST_CONFIG);
        this.IWalletJS.iost.signAndSend = (...args) => this.signAndSend(...args)
        this.IWalletJS.iost.setRPC(this.IWalletJS.rpc)
        this.IWalletJS.iost.account = new IOST.Account(this.address)
        this.IWalletJS.iost.setAccount(this.IWalletJS.iost.account)
        this.IWalletJS.iost.rpc = IWalletJS.rpc
        return this.IWalletJS.iost
    },

    setNetwork({networkURL}) {
        this.networkURL = networkURL
        this.IWalletJS.network = networkURL
        this.save()
    },

    setAddress(address) {
        this.address = address
        this.IWalletJS.account = {
            name: address
        }
        this.save()
    },

    save() {
        window.IWalletJS = this.IWalletJS
    }

}

export default iost