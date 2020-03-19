import {APP_STATE} from './../../../constants/index'
import {createReducer,createAction} from 'redux-starter-kit'

export const setAppState = createAction('setAppState')
export const setTransactionQueue = createAction('setTransactionQueue')
export const setSelectedAccount = createAction('setSelectedAccount')
export const setSetting = createAction('setSetting')
export const setAccounts = createAction('setAccounts')

export const appReducer = createReducer({
    appState: APP_STATE.UNINITIALISED,
    transactionQueue: null,
    selectedAccount: false,
    setting: false,
    accounts: []
}, {
    [ setAppState ]: (state, { payload }) => {
        state.appState = payload;
    },
    [ setTransactionQueue ] : (state, {payload}) => {
        state.transactionQueue = payload
    },
    [ setSelectedAccount ]: (state, {payload}) => {
        state.selectedAccount = payload
    },
    [ setSetting ]: (state, {payload}) => {
        state.setting = payload
    },
    [ setAccounts ]: (state, {payload}) => {
        state.accounts = payload
    }
});