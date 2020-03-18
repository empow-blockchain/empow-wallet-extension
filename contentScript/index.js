import extensionizer from 'extensionizer'
import randomUUID from 'uuid/v4'
import RequestHandle from './../lib/requestHandle'
import injectContent from '!!raw-loader!././injectScript.js'

const mode = process.env.NODE_ENV

const contentScript = {

    connection: null,

    init() {
        
        if(mode == 'development') {
            this.inject(extensionizer.extension.getURL('injectScript.js'))
        } else {
            this.injectContent(injectContent)
        }

        this.connection = extensionizer.runtime.connect({
            name: 'tab.' + randomUUID()
        })

        this.blindEvent()
    },

    blindEvent() {

        // receive request from inject and send request to background
        window.addEventListener('message', res => {
            if(res.data.from == 'injectScript' && res.data.action == 'Request') {
                let sendData = {
                    action : res.data.action,
                    event : res.data.event,
                    data: res.data.data,
                    messageUUID : res.data.messageUUID
                }
                this.connection.postMessage(sendData)
            }
        })

        // blind event from background
        this.connection.onMessage.addListener(res => {
            res.name = 'contentScript';
            res.to = 'injectScript';
            window.postMessage(res)
        })
    },

    inject(url) {
        const container = document.head || document.documentElement
        const scriptTag = document.createElement('script')
        scriptTag.setAttribute('async', false)
        scriptTag.src = url
        container.insertBefore(scriptTag, container.children[0])

        scriptTag.onload = function () {
            this.parentNode.removeChild(this);
        }
    },

    injectContent(content) {
        const container = document.head || document.documentElement
        const scriptTag = document.createElement('script')
        scriptTag.setAttribute('async', false)
        scriptTag.textContent = injectContent
        container.insertBefore(scriptTag, container.children[0])
        container.removeChild(scriptTag)
    }
}

contentScript.init()