import Axios from 'axios'
import { RPC, HTTPProvider, Tx } from 'empowjs'

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

const empow = {
    request: null,
    networkURL: null,
    address: null,
    rpc: null,
    empow: {},

    init(request) {
        this.request = request

        this.empow.enable = () => this.enable()
        this.empow.callABI = (...args) => this.callABI(...args)
        this.empow.signAndSend = (...args) => this.signAndSend(...args)
        this.save()
    },

    callABI(contract, abi, args) {
        const t = new Tx(1, 1000000);
        t.addAction(contract, abi, JSON.stringify(args));
        return t
    },

    sendTransaction(transaction) {
        return new Promise((resolve, reject) => {
            this.request.send('Request', 'empowSendTransaction', transaction, resolve, reject)
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
            this.request.send('Request', 'connectEmpowWallet', null, resolve, reject)
        })
    },

    setNetwork({networkURL}) {
        this.networkURL = networkURL
        this.empow.rpc = new RPC(new HTTPProvider(networkURL))
        this.save()
    },

    setAddress(address) {
        this.address = address
        this.save()
    },

    save() {
        window.empow = this.empow
    }

}

export default empow