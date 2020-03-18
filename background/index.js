import MessageHandle from './handles/message'
import BackgroundAPI from './BackgroundAPI'

const background = {

    run () {
        this.tabHandle = new MessageHandle('tab')
        this.popupHandle = new MessageHandle('popup')
        this.api = new BackgroundAPI()

        this.blindEvent()
    },

    blindEvent () {
        this.tabHandle.on('ReceiveRequest', (req) => (
            this.api.onTabRequest(req)
        ))

        this.popupHandle.on('ReceiveRequest', (req) => (
            this.api.onPopupRequest(req)
        ))

        this.popupHandle.on('Connect', () => {	
            this.api.onPopupConnect()	
        })	

         this.popupHandle.on('Disconnect', () => {	
            this.api.onPopupDisconnect()	
        })

        this.api.on('newTabResponse', (res) => (
            this.tabHandle.newResponse(res.uuid, res.messageUUID, res.data)
        ))

        this.api.on('newPopupResponse', (res) => (
            this.popupHandle.newResponse('default', res.messageUUID, res.data)
        ))

        this.api.on('newTabUpdate', res => (
            this.tabHandle.newUpdate(res.event, res.data)
        ))

        this.api.on('newPopupUpdate', res => (
            this.popupHandle.newUpdate(res.event, res.data)
        ))
    }
}

background.run();