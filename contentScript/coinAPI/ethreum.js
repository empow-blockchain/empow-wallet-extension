import Web3 from 'web3'

const ethereum = {

    request: null,
    provider: null,
    web3: null,
    address: null,
    networkID: "1",

    init(request) {
        this.request = request
        
        this.blindProvider()
        this.save()
    },
    blindProvider() {
        let provider = {}
        provider.selectedAddress = this.address
        provider.enable = this.enable.bind(this)
        provider.send = this.send.bind(this)
        provider.sendAsync = this.sendAsync.bind(this)
        provider.networkVersion = "1"

        this.provider = new Proxy(provider, {
            deleteProperty: () => true,
        })
    },
    jsonRpcRequest(payload) {
        return new Promise( (resolve, reject) => {
            this.request.send("Request", 'ethereumJsonRpc', payload, resolve, reject)
        })
    },
    async sendAsync (payload,callback) {
        if(!callback) return this.send(payload)

        if(Array.isArray(payload)) {
            const result = []

            for(var i = 0; i < payload.length; i++) {

                const onePayload = payload[i]

                const res = await this.jsonRpcRequest(onePayload)
                result[i] = {
                    jsonrpc: onePayload.jsonrpc,
                    id: onePayload.id,
                    result: res.result
                }
            }

            callback(null, result)
        } else {
            this.jsonRpcRequest(payload).then(res => {
                if(res.result.error) {
                    let errorMessage = res.result.error.message ? res.result.error.message : res.result.error
                    callback(new Error(errorMessage))
                } else {
                    callback(null,res)
                }
            }).catch(error => {
                callback(error)
            })
        }
    },
    send(payload, callback) {
        if(callback) return this.sendAsync(payload,callback)

        let result = null;

        switch (payload.method) {
            case 'eth_accounts':
                result = this.address ? [this.address] : []
                break
            case 'eth_coinbase':
                result = this.address
                break
            case 'net_version':
                result = this.networkID
                break
            default:
                throw new Error('Wallet does not support this function')
                break
        }

        return {
            id: payload.id,
            jsonrpc: payload.jsonrpc,
            result
        }
    },
    enable() {
        return new Promise( (resolve,reject) => {
            this.request.send('Request', 'connectEthereumWallet', null, resolve, reject)
        })
    },
    setAddress(address) {
        this.address = address
        this.provider.selectedAddress = address
        window.ethereum = this.provider
    },
    setNetwork(network) { 
        this.networkID = network.id
        this.provider.networkVersion = network.id
        window.ethereum = this.provider
    },
    save() {
        window.ethereum = this.provider
        if(!window.Web3) window.Web3 = Web3
        if(!window.web3) window.web3 = new Web3(this.provider)
    }

}

export default ethereum