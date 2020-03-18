const eos = {   

    request: null,
    EOS: {},

    init (request) {
        this.request = request
        this.EOS.enable = this.enable.bind(this)
        this.EOS.send = this.send.bind(this)
        this.saveEos()
    },

    send(transaction) {
        return new Promise ( (resolve,reject) => {
            this.request.send('Request', 'eosSendTransaction', transaction, resolve, reject)
        })
    },

    enable () {
        return new Promise ( (resolve,reject) => {
            this.request.send('Request', 'connectEosWallet', null, resolve, reject)
        })
    },

    saveEos () {
        window.eos = this.EOS
    }

}

export default eos