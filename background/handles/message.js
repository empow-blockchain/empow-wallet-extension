import EventEmitter from 'eventemitter3'
import extensionizer from 'extensionizer';

class MessageHandle extends EventEmitter {
    constructor (type) {
        super()
        
        this.listUUID = new Map()


        extensionizer.runtime.onConnect.addListener((connection) => {

            let connectionArray = connection.name.split('.')

            let from = connectionArray[0]
            let uuid = connectionArray[1]

            if(from == type) {

                this.listUUID.set(uuid, connection)

                console.log("NEW CONNECT : " + from + ' - ' + uuid)

                this.emit("Connect")

                connection.onMessage.addListener(req => {
                    let action = req.action
                    let event = req.event
                    let data = req.data
                    let messageUUID = req.messageUUID

                    if(action == 'Request') {
                        this.handleRequest(uuid, messageUUID, event, data)
                    }
                });

                connection.onDisconnect.addListener(() => {
                    console.log("DISCONNECTED : " + from + ' - ' + uuid)
                    this.listUUID.delete(uuid)
                    this.emit("Disconnect")
                })
            }
        })
    }

    handleRequest (uuid, messageUUID, event, data) {
        var emitData = {
            uuid,
            messageUUID,
            event,
            data
        }

        this.emit('ReceiveRequest', emitData);
    }

    newResponse(uuid, messageUUID, data) {
        var connection = this.listUUID.get(uuid);

        var postData = {
            action: 'RequestReply',
            messageUUID,
            data
        }

        connection.postMessage(postData)
    }

    newUpdate(event, data) {
        this.listUUID.forEach((connection) => {
            connection.postMessage({
                action: 'Update',
                event,
                data
            })
        })

    }
}

export default MessageHandle;