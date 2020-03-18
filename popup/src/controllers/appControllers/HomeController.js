import React, { Component } from 'react'
import IconSearch from '../../assets/images/icon-search.svg'
import IconSetting from '../../assets/images/icon-setting.svg'
import IconIncrease from '../../assets/images/icon-increase.png'
import IconReduction from '../../assets/images/icon-reduction.png'
import LoadingIcon from '../../assets/images/loading.svg'
import CoinIcon from '../../components/CoinIcon'

import PopupAPI from 'popup/PopupAPI'
import equal from 'fast-deep-equal'

import { APP_STATE, CURRENCY_SYMBOL } from 'constants/index'
import Utils from 'lib/utils'

class HomeController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            totalBalance: 0,
            totalBalanceBtc: 0,
            isShowCoin: true,
            isShowToken: true,
            route: null
        }
    }

    componentDidMount() {
        const { accountInfo } = this.props
        if (!accountInfo || accountInfo.length == 0) return;
        this.calcTotalBalance(accountInfo)
        this.setState({
            loading: false
        })
    }

    componentDidUpdate(prevProps) {
        if (equal(this.props, prevProps)) return;
        const { accountInfo } = this.props
        // if(!accountInfo || accountInfo.length == 0) return;
        this.calcTotalBalance(accountInfo)
        this.setState({
            loading: false
        })
    }

    calcTotalBalance(accountInfo) {

        let totalBalance = 0;
        let totalBalanceBtc = 0;

        accountInfo.map(value => {
            if (value && value.balance && typeof value.marketData[this.props.setting.currency] == 'number') {
                const balance = parseFloat(value.balance)
                totalBalance += parseFloat(balance * value.marketData[this.props.setting.currency])
            }
        })

        if (accountInfo[0] && accountInfo[0].marketData)
            totalBalanceBtc = parseFloat(totalBalance / accountInfo[0].marketData[this.props.setting.currency])

        this.setState({
            totalBalance: totalBalance.toFixed(2),
            totalBalanceBtc: totalBalanceBtc.toFixed(8)
        })
    }

    onClickCoin(index) {
        PopupAPI.setSelectedCoin(index)
    }

    showSetting = () => {
        PopupAPI.setAppState(APP_STATE.SETTING)
    }

    showSearch = () => {
        PopupAPI.setAppState(APP_STATE.SEARCH)
    }

    renderListCoin() {

        const { isShowCoin, isShowToken } = this.state
        const { setting } = this.props

        return (
            <ul className="scroll" style={{ marginTop: '20px' }}>
                {this.props.accountInfo.map((value, index) => {

                    if (!value) return;
                    if (!setting.showZeroBalance && (value.balance == 0 || !value.balance)) return;
                    if (setting.listCoinDisabled.hasOwnProperty(value.symbol.toLowerCase()) && setting.listCoinDisabled[value.symbol.toLowerCase()]) return;

                    if (value.customToken || value.type == 'BEP2') {
                        value.logo = `logo_${value.type.toLowerCase()}`
                    } else {
                        value.logo = `logo_${value.symbol.toLowerCase()}`
                    }

                    return (
                        <li key={index} onClick={() => this.onClickCoin(index)}>
                            <div className="logo-token">
                                <img src={CoinIcon[value.logo]}></img>
                            </div>
                            <div className="content" style={{ width: '70px' }}>
                                {value.temp_name ? <p>{value.temp_name}</p> : <p>{value.name.length <= 8 ? value.name : value.name.substring(0, 8) + '...'}</p>}
                                <p>{value.symbol}</p>
                            </div>
                            {value.balance ?
                                <div className="content" style={{ width: '90px' }}>
                                    <p>{Utils.formatCurrency(value.balance)} {value.symbol}</p>
                                    {value.marketData && <p>{CURRENCY_SYMBOL[setting.currency.toUpperCase()]} {parseFloat(value.balance * value.marketData[setting.currency]).toFixed(2).toString()}</p>}
                                </div>
                                :
                                <div className="content" style={{ width: '90px' }}>
                                    <p>0 {value.symbol}</p>
                                    <p>{CURRENCY_SYMBOL[setting.currency.toUpperCase()]} 0</p>
                                </div>
                            }
                            <div className="chart">
                                <img src={value.marketData.usd_24h_change > 0 ? IconIncrease : IconReduction}></img>
                                <p>{`${value.marketData.usd_24h_change.toFixed(2)}%`}</p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        )
    }

    renderLoading() {
        return (
            <div className="right-panel" id="home">
                <div className="loading">
                    <img src={LoadingIcon} />
                    <p>Loading balances...</p>
                </div>
            </div>
        )
    }

    renderContent() {

        const { setting } = this.props

        return (
            <div className="right-panel" id="home">
                <div className="waper-header">
                    <div className="header">
                        <img onClick={() => this.showSearch()} src={IconSearch} className="btn-search"></img>
                        <div className="header-right">
                            <img onClick={() => this.showSetting()} src={IconSetting}></img>
                        </div>
                    </div>
                    <div className="titler">
                        <p>Your total balance</p>
                        <h1>{CURRENCY_SYMBOL[setting.currency.toUpperCase()]} {Utils.formatCurrency(this.state.totalBalance, 2)}</h1>
                        <p>~{this.state.totalBalanceBtc} BTC</p>
                    </div>
                </div>
                {/* <div className="waper-button">
                    <button className={!this.state.isShowCoin ? 'not-show' : ''} onClick={() => { this.setState({ isShowCoin: !this.state.isShowCoin }) }}>
                        <p>Coin</p>
                    </button>
                    <button className={!this.state.isShowToken ? 'not-show' : ''} onClick={() => { this.setState({ isShowToken: !this.state.isShowToken }) }}>
                        <p>Token</p>
                    </button>
                </div> */}
                {this.renderListCoin()}
            </div>
        );
    }

    onBack = () => {
        this.setState({
            route: null
        })
    }

    render() {
        if (this.state.loading) return this.renderLoading()
        if (this.state.route === null) {
            return this.renderContent()
        } else {
            return this.listController[this.state.route];
        }
    }
}

export default HomeController;