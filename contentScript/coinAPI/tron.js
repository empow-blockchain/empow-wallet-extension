import TronWeb from 'tronweb'
import { NODE } from 'constants/index'
import Utils from 'lib/utils'

const tron = {
    tronWeb : false,
    request: false,
    network:  NODE.TRON.MAINNET,

    init(request) {
        this.request = request

        this.resetTronWeb()
        this.save()
    },

    resetTronWeb() {
        this.tronWeb = new TronWeb(this.network)

        this.tronWeb.ready = false;
    },

    setReady () {
        this.tronWeb.ready = true;
    },

    disableMethod () {
        [ 'setPrivateKey', 'setAddress', 'setFullNode', 'setSolidityNode', 'setEventServer' ].forEach(method => (
            this.tronWeb[ method ] = () => new Error('Disabled this method')
        ));
    },

    setAddress(address) {
        if(!this.tronWeb.isAddress(address)) return
        this.address = address
        this.resetTronWeb()
        this.tronWeb.setAddress(address)
        this.setReady()
        this.disableMethod()
        this.blindSign()
        this.save()
    },

    setNetwork(network) {
        this.network = network
        this.tronWeb = new TronWeb(this.network)
        if(this.address) this.tronWeb.setAddress(this.address)
        this.setReady()
        this.disableMethod()
        this.blindSign()
        this.save()
    },

    blindSign () {
        this.tronWeb.trx.sign = (...args) => (
            this.sign(...args)
        )
    },

    sign(transaction, callback) {
        if(!callback) return this.signRequest(transaction)
    
        this.signRequest(transaction).then( res => (
            callback(null,res)
        )).catch(err => (
            callback(err)
        ))
    },

    signRequest(transaction) {
        return new Promise( (resolve, reject) => {
            this.request.send('Request', 'tronSignTransaction', transaction, resolve, reject)
        })
    },

    save() {
        window.tronWeb = this.tronWeb
    }
}

export default tron