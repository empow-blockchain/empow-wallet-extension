import empow from './coinAPI/empow'
import RequestHandle from './../lib/requestHandle'

const tab = {

    async init() {
        this.request = new RequestHandle({
            name: 'injectScript',
            to: 'contentScript'
        }, true) // isWindowEvent = true

        this.blindEvent()

        empow.init(this.request)
    
        let address = await this.getWalletInfo()

        if(address) {
            empow.setAddress(address)
        }
        
        this.getNetwork().then(res => {
            empow.setNetwork(res)
        })
    },

    blindEvent() {
        this.request.on('updateAddress', res =>  {
            empow.setAddress(address)
        })

        this.request.on('updateNetwork', res => {
            empow.setNetwork(res)
        })
    },

    getNetwork () {
        return new Promise((resolve, reject) => (
            this.request.send('Request', 'getNetwork', null, resolve, reject)
        ))
    },

    getWalletInfo() {
        return new Promise((resolve, reject) => (
            this.request.send('Request', 'getWalletInfo', null, resolve, reject)
        ))
    },
}


tab.init();