import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/index';
import reduxLogger from 'redux-logger';
import { Provider } from 'react-redux';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import reducer from './reducers/index'
import requestHandle from 'lib/requestHandle'
import extensionizer from 'extensionizer'
import PopupAPI from 'popup/PopupAPI'

import {
    setAppState,
    setTransactionQueue,
    setAllAccountInfo,
    setAccountInfo,
    setSelectedCoin,
    setSetting
} from './reducers/appReducer'

import { APP_STATE } from '../../constants';

const popup = {

    store: null,
    requestHandle: null,

    run() {
        this.store = configureStore({
            middleware: [
                ...getDefaultMiddleware(),
                // reduxLogger
            ],
            reducer
        });

        this.connect()
    },

    connect() {
        var connection = extensionizer.runtime.connect({
            name: 'popup.default'
        })

        PopupAPI.init(connection);
        this.requestHandle = new requestHandle(connection)

        this.getinfo()
        this.blindEvents()
    },

    async getinfo() {
        let appState = await PopupAPI.getAppState()
        this.store.dispatch(setAppState(appState))

        if(appState >= APP_STATE.READY && appState != APP_STATE.SIGN_TRANSACTION) {

            let setting = await PopupAPI.getSetting()
            this.store.dispatch(setSetting(setting))
            this.store.dispatch(setToggle(setting.showLeftPanel))

            let allAccountInfo = await PopupAPI.getAllAccountInfo()
            this.store.dispatch(setAllAccountInfo(allAccountInfo))

            let selectedCoin = await PopupAPI.getSelectedCoin ()
            this.store.dispatch(setSelectedCoin(selectedCoin))
        }

        if(appState == APP_STATE.SIGN_TRANSACTION) {
            let transactionQueue = await PopupAPI.getTransactionQueue()
            this.store.dispatch(setTransactionQueue(transactionQueue))
        }

        this.render()
    },

    blindEvents () {
        this.requestHandle.on('updateAppState', appState => (
            this.store.dispatch(setAppState(appState))
        ))

        this.requestHandle.on('updateTransactionQueue', transaction => (
            this.store.dispatch(setTransactionQueue(transaction))
        ))

        this.requestHandle.on('updateAllAccountInfo', accountInfo => (
            this.store.dispatch(setAllAccountInfo(accountInfo))
        ))

        this.requestHandle.on('updateAccountInfo', accountInfo => {
            this.store.dispatch(setAccountInfo(accountInfo))
        })

        this.requestHandle.on('updateSelectedCoin', index => (
            this.store.dispatch(setSelectedCoin(index))
        ))

        this.requestHandle.on('updateSetting', setting => {
            this.store.dispatch(setSetting(setting))
            this.store.dispatch(setToggle(setting.showLeftPanel))
        })
    },

    render() {
        ReactDOM.render(
            <Provider store={ this.store }>
                <App />
            </Provider>,
            document.getElementById('root')
        );
    }

}

popup.run()