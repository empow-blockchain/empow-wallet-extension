import React, {Component} from 'react'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import ArrowRight from '../../assets/images/arrow-right.svg'
import IconChangeNetWork from '../../assets/images/icon-change-network.svg'
import IconAddToken from '../../assets/images/icon-add-token.svg'
import IconCurrency from '../../assets/images/icon-currency.svg'
import IconExport from '../../assets/images/icon-export.svg'
import IconChangePassword from '../../assets/images/icon-change-password.svg'
import IconAutoLock from '../../assets/images/icon-auto-lock.svg'
import IconTermOfService from '../../assets/images/icon-term-of-service.svg'
import Button from '../../components/Button'
import ChangeNetworkController from './ChangeNetworkController'
import AddTokenController from './AddTokenController'
import CurrencyController from './CurrencyController'
import ExportAccountController from './ExportAccountController'
import ChangePasswordController from './ChangePasswordController'
import AutoLockController from './AutoLockController'
import { APP_STATE } from '../../../../constants';
import PopupAPI from 'popup/PopupAPI'

class SettingController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            route: null
        };

        this.listController = {
            changeNetWork: <ChangeNetworkController networks={props.setting.networks} onBack={this.onBackSetting} onBackHome={this.onBack}/>,
            addToken: <AddTokenController onBack={this.onBackSetting}/>,
            currency: <CurrencyController currency={props.setting.currency} onBackHome={this.onBack} onBack={this.onBackSetting}/>,
            exportAccount: <ExportAccountController accounts={props.accounts} onBack={this.onBackSetting}/>,
            changePassword: <ChangePasswordController onBack={this.onBackSetting}/>,
            autoLock: <AutoLockController autolock={props.setting.autolock} onBack={this.onBackSetting}/>
        }
    };

    onChangeNetwork = () => {
        this.setState({
            route: "changeNetWork"
        })
    }

    // onAddToken = () => {
    //     this.setState({
    //         route: "addToken"
    //     })

    // }

    onCurrency = () => {
        this.setState({
            route: "currency"
        })
    }

    onExportAccount = () => {
        this.setState({
            route: "exportAccount"
        })
    }

    onChangePassword = () => {
        this.setState({
            route: "changePassword"
        })
    }

    onAutoLock = () => {
        this.setState({
            route: "autoLock"
        })
    }

    onTermOfService = () => {
        window.open('https://empow.io/termsofservice','_blank');
    }

    onBackSetting = () => {
        this.setState({
            route: null
        })
    }

    onBack () {
        PopupAPI.setAppState(APP_STATE.READY)
    }

    onLogout () {
        PopupAPI.lock()
    }

    renderSetting() {
        return (
            <div className="right-panel bg-general" id="setting">
            <img onClick={this.onBack} src={ArrowLeft} className="btn-back"></img>
            <ul className="menu-general">
                <li onClick={this.onChangeNetwork}>
                    <img className="img-circle" src={IconChangeNetWork}></img>
                    <p className="title">Change network</p>
                    <img src={ArrowRight} className="arrow-icon"></img>
                </li>
                {/* <li onClick={this.onAddToken}>
                    <img className="img-circle" src={IconAddToken}></img>
                    <p className="title">Add token</p>
                    <img src={ArrowRight} className="arrow-icon"></img>
                </li> */}
                <li onClick={this.onCurrency}>
                    <img className="img-circle" src={IconCurrency}></img>
                    <p className="title">Currency</p>
                    <img src={ArrowRight} className="arrow-icon"></img>
                </li>
                <li onClick={this.onExportAccount}>
                    <img className="img-circle" src={IconExport}></img>
                    <p className="title">Export Account</p>
                    <img src={ArrowRight} className="arrow-icon"></img>
                </li>
                <li onClick={this.onChangePassword}>
                    <img className="img-circle" src={IconChangePassword}></img>
                    <p className="title">Change Password</p>
                    <img src={ArrowRight} className="arrow-icon"></img>
                </li>
                <li onClick={this.onAutoLock}>
                    <img className="img-circle" src={IconAutoLock}></img>
                    <p className="title">Auto lock</p>
                    <img src={ArrowRight} className="arrow-icon"></img>
                </li>
                <li onClick={this.onTermOfService}>
                    <img className="img-circle" src={IconTermOfService}></img>
                    <p className="title">Term of Service</p>
                    <img src={ArrowRight} className="arrow-icon"></img>
                </li>
            </ul>
            <Button onClick={this.onLogout}>Logout</Button>
        </div>)
    }

    render() {
        if (this.state.route === null) {
            return this.renderSetting();
        } else {
            return this.listController[this.state.route]
        }
    }
}

export default SettingController;