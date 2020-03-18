import tron from './coinAPI/tron'
import ethereum from './coinAPI/ethreum'
import eos from './coinAPI/eos'
import iost from './coinAPI/iost'
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
        ethereum.init(this.request)
        tron.init(this.request)
        eos.init(this.request)
        iost.init(this.request)

        let address = await this.getAddress()
        let ethereumAddress = address && address.ethereum ? address.ethereum : null
        let tronAddress = address && address.tron ? address.tron : null
        let iostAddress = address && address.iost ? address.iost : null
        let empowAddress = address && address.empow ? address.empow : null

        if(empowAddress) empow.setAddress(empowAddress)
        if(ethereumAddress) ethereum.setAddress(ethereumAddress)
        if(tronAddress) tron.setAddress(tronAddress)
        if(iostAddress) iost.setAddress(iostAddress)

        this.getNetwork().then(res => {
            empow.setNetwork(res.empow)
            ethereum.setNetwork(res.ethereum)
            tron.setNetwork(res.tron)
            iost.setNetwork(res.iost)
        })
    },

    blindEvent() {
        this.request.on('updateAddress', res =>  {
            ethereum.setAddress(res.ethereum)
            tron.setAddress(res.tron)
            iost.setAddress(res.iost)
        })

        this.request.on('updateNetwork', res => {
            ethereum.setNetwork(res.ethereum)
            tron.setNetwork(res.tron)
            iost.setNetwork(res.iost)
        })
    },

    getNetwork () {
        return new Promise((resolve, reject) => (
            this.request.send('Request', 'getNetwork', null, resolve, reject)
        ))
    },

    getAddress() {
        return new Promise((resolve, reject) => (
            this.request.send('Request', 'getWalletInfo', null, resolve, reject)
        ))
    },
}


tab.init();