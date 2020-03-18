import randomUUID from 'uuid/v4'
import EventEmitter from 'eventemitter3'

class RequestHandle extends EventEmitter{
    constructor (connection, isWindowEvent = false) {
        super()

        this.isWindowEvent = isWindowEvent
        this.connection = connection
        this.queue = new Map()

        this.blindRequestReply();
        this.blindNewUpdate();
    }

    blindNewUpdate () {
        if(!this.isWindowEvent) {
            this.connection.onMessage.addListener((res) => {
                if(res.action == 'Update') {
                    this.emit(res.event, res.data)
                }
            })
        } else {
            window.addEventListener('message', res => {
                if(res.data.action == 'Update' && res.data.to == this.connection.name) {
                    this.emit(res.data.event, res.data.data)
                }
            })
        }
    }

    blindRequestReply() {

        var _this = this;

        if(!this.isWindowEvent) {
            this.connection.onMessage.addListener(res => {
                if(res.action == 'RequestReply') {
                    _this.handleRequestReply(res);
                }
            });
        } else {
            window.addEventListener('message', res => {
                if(res.data.action == 'RequestReply' && res.data.to == this.connection.name) {
                    this.handleRequestReply(res.data)
                }
            })
        }
        
    }

    handleRequestReply (res) {

        let uuid = res.messageUUID;

        if(!this.queue.get(uuid)) 
            return

        if(res.data && res.data.error)
            return this.queue.get(uuid).reject(res.data.error)

        return this.queue.get(uuid).resolve(res.data)
    }

    send (action, event, data, resolve = null, reject = null) {

        var sendData = {}
        sendData.action = action
        sendData.data = data
        sendData.event = event

        if(action == 'Request') {

            let messageUUID = randomUUID()
            
            this.queue.set(messageUUID, {
                resolve,
                reject
            })

            sendData.messageUUID = messageUUID
        }

        if(!this.isWindowEvent)
            this.connection.postMessage(sendData);
        else {
            sendData.from = this.connection.name
            sendData.to = this.connection.to
            window.postMessage(sendData)
        }
    }
}

export default RequestHandle;