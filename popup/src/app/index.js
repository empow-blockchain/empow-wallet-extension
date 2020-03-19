import React from 'react';
import { connect } from 'react-redux';
import { APP_STATE } from 'constants/index'
import autosize from 'autosize'

import RegisterController from 'popup/controllers/appControllers/RegisterController'
import UnlockController from 'popup/controllers/appControllers/UnlockController'
import SignTransactionController from 'popup/controllers/appControllers/SignTransactionController'
import CreateWalletController from 'popup/controllers/appControllers/CreateWalletController'
import RestoreWalletController from 'popup/controllers/appControllers/RestoreWalletController'
import CreateNewWalletController from 'popup/controllers/appControllers/CreateNewWalletController'
import HomeController from 'popup/controllers/appControllers/HomeController'
import SearchController from 'popup/controllers/appControllers/SearchController'
import CoinDetailController from 'popup/controllers/appControllers/CoinDetailController'
import SettingController from 'popup/controllers/appControllers/SettingController'

import 'popup/assets/scss/style.scss'

class App extends React.Component {

    changeWidth(width) {
        $("body").width(width)
    }

    componentDidMount() {
        autosize(document.querySelectorAll('textarea'));
    }

    render() {
        const {
            appState,
            transactionQueue,
            allAccountInfo,
            selectedCoin,
            setting,
            accounts,
            selectedAccount
        } = this.props;

        let dom = null;

        switch (appState) {
            case APP_STATE.UNINITIALISED:
                dom = <RegisterController />;
                break;
            case APP_STATE.PASSWORD_SET:
                dom = <UnlockController />;
                break;
            case APP_STATE.UNLOCKED:
                dom = <CreateWalletController />;
                break;
            case APP_STATE.CREATING:
                dom = <CreateNewWalletController />;
                break;
            case APP_STATE.RESTORING:
                dom = <RestoreWalletController />;
                break;
            case APP_STATE.READY:
                dom = <HomeController accounts={accounts} accountInfo={selectedAccount} setting={setting} />
                break;
            case APP_STATE.COIN_DETAIL:
                dom = <CoinDetailController accountInfo={selectedAccount} setting={setting}/>
                break;
            case APP_STATE.SEARCH:
                dom = <SearchController accountInfo={selectedAccount} setting={setting} />
                break;
            case APP_STATE.SETTING:
                dom = <SettingController accounts={accounts} accountInfo={selectedAccount} setting={setting} />
                break;
            case APP_STATE.SIGN_TRANSACTION:
                dom = <SignTransactionController transaction={transactionQueue} />;
                break;
            default:
                dom = <div>Can not get APP_STATE</div>;
                break;
        }

        return dom;
    }

}

export default connect(state => ({
    appState: state.app.appState,
    transactionQueue: state.app.transactionQueue,
    selectedAccount: state.app.selectedAccount,
    setting: state.app.setting,
    accounts: state.app.accounts
}))(App);