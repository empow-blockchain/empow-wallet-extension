import {APP_STATE} from './../../../constants/index'
import {createReducer,createAction} from 'redux-starter-kit'

export const setAppState = createAction('setAppState')
export const setTransactionQueue = createAction('setTransactionQueue')
export const setAllAccountInfo = createAction('setAllAccountInfo')
export const setAccountInfo = createAction('setAccountInfo')
export const setSelectedCoin = createAction('setSelectedCoin')
export const setSetting = createAction('setSetting')

export const appReducer = createReducer({
    appState: APP_STATE.UNINITIALISED,
    transactionQueue: null,
    allAccountInfo: [],
    selectedCoin: false,
    setting: false,
}, {
    [ setAppState ]: (state, { payload }) => {
        state.appState = payload;
    },
    [ setTransactionQueue ] : (state, {payload}) => {
        state.transactionQueue = payload
    },
    [ setAllAccountInfo ]: (state, {payload}) => {
        state.allAccountInfo = payload
    },
    [ setAccountInfo ]: (state, {payload}) => {
        state.allAccountInfo[payload.index] = payload.accountInfo
    },
    [ setSelectedCoin ]: (state, {payload}) => {
        state.selectedCoin = payload
    },
    [ setSetting ]: (state, {payload}) => {
        state.setting = payload
    }
});