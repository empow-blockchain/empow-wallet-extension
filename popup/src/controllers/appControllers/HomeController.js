import React, { Component } from 'react'
import IconSearch from '../../assets/images/icon-search.svg'
import IconSetting from '../../assets/images/icon-setting.svg'
import IconIncrease from '../../assets/images/icon-increase.png'
import IconReduction from '../../assets/images/icon-reduction.png'
import LoadingIcon from '../../assets/images/loading.svg'
import CoinIcon from '../../components/CoinIcon'
import Slider from 'react-rangeslider'
import Select from 'react-select';
import PopupAPI from 'popup/PopupAPI'
import equal from 'fast-deep-equal'
import IconClose from '../../assets/images/icon-close.svg'
import { APP_STATE, CURRENCY_SYMBOL } from 'constants/index'
import Utils from 'lib/utils'
import Button from '../../components/Button'
import '../../assets/css/rangeslider.css';
import ImgTransactionSuccess from '../../assets/images/img-transaction-success.svg'
import { QRCode } from "react-qr-svg";
import ButtonCopy from '../../components/ButtonCopy';
import IconCopy2 from '../../assets/images/icon-copy2.svg'
import ArrowDown from '../../assets/images/arrow-down.svg'
import DeleteIcon from '../../assets/images/delete-icon.svg'
import CreateIcon from '../../assets/images/icon-create.svg'
import RestoreIcon from '../../assets/images/icon-restore.svg'

class HomeController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            route: null,
            showRamEM: false,
            showGas: false,
            defaultMenuStake: 1,
            defaultMenuRam: 1,
            avaiableEos: props.accountInfo.balance || 0,
            reclaimingEOS: 0,
            buyRamValue: 0,
            sellRamValue: 0,
            stakeCpuValue: 0,
            unstakeCpuValue: 0,
            sendLoading: false,
            sendError: false,
            sendSuccess: false,
            showReceive: false,
            showSend: false,
            showTransactionSuccess: false,
            sendTo: '',
            sendAmount: 0,
            sendMemo: '',
            stakeNetValue: 0,
            unstakeNetValue: 0,
            showSwitchWallet: false,
        }
    }

    async componentDidMount() {
        const { accountInfo } = this.props
        if (!accountInfo) return;
        this.setState({
            loading: false,
        })
    }

    async componentDidUpdate(prevProps) {
        if (equal(this.props, prevProps)) return;
        const { accountInfo } = this.props
        if (!accountInfo) return;

        this.setState({
            loading: false,
        })
    }

    onClickCoin() {
        PopupAPI.setAppState(APP_STATE.COIN_DETAIL)
    }

    showSetting = () => {
        PopupAPI.setAppState(APP_STATE.SETTING)
    }

    showSearch = () => {
        PopupAPI.setAppState(APP_STATE.SEARCH)
    }

    togglePopup = (name) => {
        this.setState({
            [name]: !this.state[name]
        })
    }

    onClickImportWallet = () => {
        PopupAPI.setAppState(APP_STATE.RESTORING)
    }

    onClickCreateWallet = () => {
        PopupAPI.setAppState(APP_STATE.CREATING)
    }

    onChangeAccount = (address) => {
        PopupAPI.setSelectedAccount(address)
        this.setState({
            showSwitchWallet: !this.state.showSwitchWallet
        })
    }

    onDeleteAccount = (address) => {
        const { accounts } = this.props
        if (accounts.length === 1) {
            return;
        }
        var newAccounts = accounts.filter(x => x.address !== address)
        PopupAPI.setAccounts(newAccounts)
    }

    selectMenuStake = (index) => {
        this.setState({
            defaultMenuStake: index
        })
    }

    selectMenuRam = (index) => {
        this.setState({
            defaultMenuRam: index
        })
    }

    onChangeBuyRam = (buyRamValue) => {
        const { ramPrice, balance } = this.props.accountInfo
        let avaiableEos = balance - (buyRamValue * ramPrice)

        avaiableEos = avaiableEos.toFixed(2)

        this.setState({
            buyRamValue,
            avaiableEos
        })
    }

    buyRamEM = () => {
        this.setState({
            sendLoading: true,
            sendError: false
        })

        PopupAPI.buyRamEM(this.state.buyRamValue).then(res => {
            this.setState({
                sendLoading: false,
                showRamEM: false,
                sendSuccess: res.txid.tx_hash,
                showTransactionSuccess: true
            })
        }).catch(error => {
            this.setState({
                sendLoading: false,
                sendError: error
            })
        })
    }

    onChangeSellRam = (sellRamValue) => {

        const { ramPrice } = this.props.accountInfo
        let reclaimingEOS = sellRamValue * ramPrice

        reclaimingEOS = reclaimingEOS.toFixed(2)

        this.setState({
            sellRamValue,
            reclaimingEOS
        })
    }

    sellRamEM() {
        this.setState({
            sendLoading: true,
            sendError: false
        })

        PopupAPI.sellRamEM(this.state.sellRamValue).then(res => {
            this.setState({
                sendLoading: false,
                showRamEM: false,
                sendSuccess: res.txid.tx_hash,
                showTransactionSuccess: true
            })
        }).catch(error => {
            this.setState({
                sendLoading: false,
                sendError: error
            })
        })
    }

    onChangeStake = (stakeCpuValue, stakeNetValue) => {
        const { balance } = this.props.accountInfo

        let avaiableEos = balance - (stakeCpuValue + stakeNetValue)
        avaiableEos = avaiableEos.toFixed(2)

        this.setState({
            stakeCpuValue,
            stakeNetValue,
            avaiableEos: avaiableEos
        })
    }

    onChangePledge = (stakeCpuValue) => {
        const { balance } = this.props.accountInfo

        if (stakeCpuValue === '') {
            this.setState({
                stakeCpuValue,
            })
            return;
        }

        let avaiableEos = balance - parseFloat(stakeCpuValue)
        avaiableEos = avaiableEos.toFixed(2)

        this.setState({
            stakeCpuValue,
            avaiableEos: avaiableEos
        })
    }

    onPledge = () => {
        const { stakeCpuValue } = this.state

        this.setState({
            sendLoading: true,
            sendError: false
        })

        PopupAPI.pledge(stakeCpuValue).then(res => {
            this.setState({
                sendLoading: false,
                showGas: false,
                sendSuccess: res.txid,
                showTransactionSuccess: true
            })
        }).catch(error => {
            this.setState({
                sendLoading: false,
                sendError: error
            })
        })
    }

    onChangeUnstake = (unstakeCpuValue, unstakeNetValue) => {

        let reclaimingEOS = unstakeCpuValue + unstakeNetValue

        reclaimingEOS = reclaimingEOS.toFixed(2)

        this.setState({
            unstakeCpuValue,
            unstakeNetValue,
            reclaimingEOS
        })
    }

    onChangeUnpledge = (unstakeCpuValue) => {
        if (unstakeCpuValue === '') {
            this.setState({
                unstakeCpuValue,
            })
            return;
        }
        unstakeCpuValue = parseFloat(unstakeCpuValue)
        let reclaimingEOS = unstakeCpuValue.toFixed(2)

        this.setState({
            unstakeCpuValue,
            reclaimingEOS
        })
    }

    onUnpledge = () => {
        const { unstakeCpuValue } = this.state

        this.setState({
            sendLoading: true,
            sendError: false
        })

        PopupAPI.unpledge(unstakeCpuValue).then(res => {
            this.setState({
                sendLoading: false,
                showGas: false,
                sendSuccess: res.txid,
                showTransactionSuccess: true
            })
        }).catch(error => {
            this.setState({
                sendLoading: false,
                sendError: error
            })
        })
    }

    onBlurInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSend = () => {
        const accountInfo = this.props.accountInfo
        const { sendTo, sendAmount, sendMemo } = this.state

        this.setState({
            sendLoading: true,
            sendError: false
        })

        PopupAPI.send(accountInfo, sendTo, sendAmount, sendMemo).then(res => {
            this.setState({
                sendLoading: false,
                sendSuccess: res.txid ? res.txid : 'Send Transaction successfully',
                showTransactionSuccess: true
            })
        }).catch(error => {
            this.setState({
                sendError: error,
                sendLoading: false
            })
        })
    }

    renderListCoin() {

        var { setting, accountInfo } = this.props
        accountInfo = accountInfo || {}

        return (
            <ul className="scroll" style={{ marginTop: '20px' }}>
                <li onClick={() => this.onClickCoin()}>
                    <div className="logo-token">
                        <img src={CoinIcon['logo_em']}></img>
                    </div>
                    <div className="content" style={{ width: '70px' }}>
                        <p>EMPOW</p>
                        <p>EM</p>
                    </div>
                    <div className="content" style={{ width: '90px' }}>
                        <p style={{ color: 'white' }}>{Utils.formatCurrency(accountInfo.balance)} EM</p>
                        {/* {value.marketData && <p>{CURRENCY_SYMBOL[setting.currency.toUpperCase()]} {parseFloat(value.balance * value.marketData[setting.currency]).toFixed(2).toString()}</p>} */}
                    </div>
                    <div className="chart">
                        {/* <img src={value.marketData.usd_24h_change > 0 ? IconIncrease : IconReduction}></img>
                        <p>{`${value.marketData.usd_24h_change.toFixed(2)}%`}</p> */}
                        <img src={IconIncrease}></img>
                        <p>{`0.01 %`}</p>
                    </div>
                </li>
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

    renderRam() {
        var show = 'showRamEM';
        const { avaiableEos, buyRamValue, sellRamValue, defaultMenuRam, reclaimingEOS, sendLoading, sendError } = this.state
        const { ramPrice, balance, ramLimit, ramUsed } = this.props.accountInfo || {}

        const maxBuy = balance / ramPrice
        const maxSell = ramLimit - ramUsed

        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range" onClick={() => this.togglePopup(show)}></div>
                    <div className="ram">
                        <img src={IconClose} className="icon-close" onClick={() => this.togglePopup(show)}></img>
                        {sendError && <div className="alert">{sendError}</div>}
                        <div className="menu">
                            <div className={this.state.defaultMenuRam === 1 ? "child active" : "child"}>
                                <p onClick={() => this.selectMenuRam(1)}>Buy</p>
                            </div>
                            <div className={this.state.defaultMenuRam === 2 ? "child active" : "child"}>
                                <p onClick={() => this.selectMenuRam(2)}>Sell</p>
                            </div>
                        </div>
                        {defaultMenuRam == 1 ?
                            <React.Fragment>
                                <div className="group-input">
                                    <div className="waper-input">
                                        <p>Buying</p>
                                        <input type="text" value={buyRamValue} onChange={(e) => this.onChangeBuyRam(e.target.value)} />
                                    </div>
                                    <div className="waper-input">
                                        <p>Type</p>
                                        <Select className="react-select-container" classNamePrefix="react-select"
                                            isSearchable={false}
                                            options={[{ label: 'Bytes', value: 0 }]}
                                            value={{ label: 'Bytes', value: 0 }}
                                        />
                                    </div>
                                    <div className="waper-input">
                                        <p>Available EM</p>
                                        <input value={avaiableEos} disabled></input>
                                    </div>
                                </div>
                                <div className="group-slider">
                                    <div className="waper-slider">
                                        <p>RAM</p>
                                        <div className="slider">
                                            <Slider
                                                min={0}
                                                max={maxBuy}
                                                step={1}
                                                value={buyRamValue}
                                                onChange={(value) => this.onChangeBuyRam(value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-send" style={{ marginTop: '15px' }}>
                                    <Button isLoading={sendLoading} onClick={() => this.buyRamEM()}>Buy RAM</Button>
                                </div>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <div className="group-input">
                                    <div className="waper-input">
                                        <p>Selling</p>
                                        <input type="text" value={sellRamValue} onChange={(e) => this.onChangeSellRam(e.target.value)} />
                                    </div>
                                    <div className="waper-input">
                                        <p>Type</p>
                                        <Select className="react-select-container" classNamePrefix="react-select"
                                            isSearchable={false}
                                            options={[{ label: 'Bytes', value: 0 }]}
                                            value={{ label: 'Bytes', value: 0 }}
                                        />
                                    </div>
                                    <div className="waper-input">
                                        <p>Reclaiming</p>
                                        <input value={reclaimingEOS} disabled></input>
                                    </div>
                                </div>
                                <div className="group-slider">
                                    <div className="waper-slider">
                                        <p>RAM</p>
                                        <div className="slider">
                                            <Slider
                                                min={0}
                                                max={maxSell}
                                                step={1}
                                                value={sellRamValue}
                                                onChange={(value) => this.onChangeSellRam(value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-send" style={{ marginTop: '15px' }}>
                                    <Button isLoading={sendLoading} onClick={() => this.sellRamEM()}>Sell RAM</Button>
                                </div>
                            </React.Fragment>
                        }
                    </div>
                </div>
            </div>)
    }

    renderStake() {
        var show = 'showGas';

        const { stakeCpuValue, avaiableEos, sendLoading, sendError, defaultMenuStake, unstakeCpuValue, reclaimingEOS } = this.state
        const { accountInfo } = this.props

        const maxGas = accountInfo.balance;
        const maxUnGas = accountInfo.maxUnpledge;

        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range" onClick={() => this.togglePopup(show)}></div>
                    <div className="stake">
                        <img src={IconClose} className="icon-close" onClick={() => this.togglePopup(show)}></img>
                        {sendError && <div className="alert">{sendError}</div>}
                        <div className="menu">
                            <div className={defaultMenuStake === 1 ? "child active" : "child"}>
                                <p onClick={() => this.selectMenuStake(1)}>Pledge</p>
                            </div>
                            <div className={defaultMenuStake === 2 ? "child active" : "child"}>
                                <p onClick={() => this.selectMenuStake(2)}>Unpledge</p>
                            </div>
                        </div>
                        {(defaultMenuStake == 1) &&
                            <React.Fragment>
                                <div className="group-input" style={{ justifyContent: 'center' }}>
                                    <div className="waper-input">
                                        <p>GAS</p>
                                        <input value={stakeCpuValue} onChange={(e) => this.onChangePledge(e.target.value)}></input>
                                    </div>
                                    <div className="waper-input">
                                        <p>Available EM</p>
                                        <input value={avaiableEos} disabled></input>
                                    </div>
                                </div>
                                <div className="group-slider">
                                    <div className="waper-slider">
                                        <p>GAS</p>
                                        <div className="slider">
                                            <Slider
                                                min={0}
                                                max={maxGas}
                                                step={0.001}
                                                value={stakeCpuValue}
                                                onChange={(value) => this.onChangeStake(value, 0)}
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div className="btn-send" style={{ marginTop: '15px' }}>
                                    <Button isLoading={sendLoading} onClick={() => this.onPledge()}>Pledge</Button>
                                </div>
                            </React.Fragment>}

                        {(defaultMenuStake == 2) && <React.Fragment>
                            <div className="group-input" style={{ justifyContent: 'center' }}>
                                <div className="waper-input">
                                    <p>GAS</p>
                                    <input value={unstakeCpuValue} onChange={(e) => this.onChangeUnpledge(e.target.value)}></input>
                                </div>
                                <div className="waper-input">
                                    <p>Reclaiming</p>
                                    <input value={reclaimingEOS} disabled></input>
                                </div>
                            </div>
                            <div className="group-slider">
                                <div className="waper-slider">
                                    <p>GAS</p>
                                    <div className="slider">
                                        <Slider
                                            min={0}
                                            max={maxUnGas}
                                            step={0.001}
                                            value={unstakeCpuValue}
                                            onChange={(value) => this.onChangeUnstake(value, 0)}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="btn-send" style={{ marginTop: '15px' }}>
                                <Button isLoading={sendLoading} onClick={() => this.onUnpledge()}>Unpledge</Button>
                            </div>
                        </React.Fragment>
                        }
                    </div>
                </div>
            </div>)
    }

    renderTransactionSuccess() {
        var { sendSuccess } = this.state
        var { setting } = this.props

        var selectedNetwork = setting.networks.find(x => x.selected === true)
        var txURL = `${selectedNetwork.txUrl}/${sendSuccess}`

        if (sendSuccess == 'Send Transaction successfully') txURL = '#'

        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range" onClick={() => this.togglePopup('showSend')}></div>
                    <div className="transaction-success">
                        <img src={IconClose} className="icon-close" onClick={() => this.togglePopup('showTransactionSuccess')}></img>
                        <p className="title">Transaction success</p>
                        <img src={ImgTransactionSuccess}></img>
                        <p className="text">Click link below</p>
                        <a target="_blank" href={txURL}>{sendSuccess.length <= 30 ? sendSuccess : sendSuccess.substring(0, 30) + '...'}</a>
                        <p></p>
                    </div>
                </div>
            </div>
        )
    }

    renderReceive() {
        const { accountInfo } = this.props

        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range" onClick={() => this.togglePopup('showReceive')}></div>
                    <div className="receive">
                        <img src={IconClose} className="icon-close" onClick={() => this.togglePopup('showReceive')}></img>
                        <p className="title">Deposit address</p>
                        <br></br>
                        <button className="btn-copy">
                            <p>{accountInfo.address.length > 20 ? accountInfo.address.substring(0, 20) + '...' : accountInfo.address}</p>
                            <div>
                                <ButtonCopy copyIcon={IconCopy2} copyText={accountInfo.address} />
                            </div>
                        </button>
                        <div className="qr">
                            <QRCode
                                bgColor="#FFFFFF"
                                fgColor="#000000"
                                level="Q"
                                value={accountInfo.address}
                            />
                        </div>
                    </div>
                </div>
            </div>)
    }

    renderSend() {
        const { accountInfo } = this.props

        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range" onClick={() => this.togglePopup('showSend')}></div>
                    <div className="send">
                        <img src={IconClose} className="icon-close" onClick={() => this.togglePopup('showSend')}></img>
                        <p className="title">Send</p>
                        <br></br>
                        <ul className="menu-general-2">
                            <li>
                                <input placeholder="To" name="sendTo" onBlur={(e) => this.onBlurInput(e)}></input>
                            </li>
                            <li>
                                <input placeholder="Amount" type="number" name="sendAmount" onBlur={(e) => this.onBlurInput(e)}></input>
                                <span className="symbol" style={{ fontSize: '14px' }}>{accountInfo.symbol}</span>
                            </li>
                            {accountInfo.memo &&
                                <li>
                                    <input placeholder="Memo" name="sendMemo" onBlur={(e) => this.onBlurInput(e)}></input>
                                </li>
                            }
                        </ul>
                        {this.state.sendError &&
                            <div>
                                <div className="alert">{this.state.sendError}</div>
                            </div>
                        }
                        <div className="btn-send">
                            <Button isLoading={this.state.sendLoading} onClick={() => this.onSend()}>Send</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderListWallet() {
        const { accounts } = this.props
        return (
            <div className="overlay">
                <ul className="list-wallet">
                    {accounts.map((account, index) => {
                        return <li onClick={() => this.onChangeAccount(account.address)}>
                            <div className="left">
                                <p className="label">{account.username ? account.username : `Wallet ${index + 1}`}</p>
                                <p className="address">{account.address.substring(0, 15) + '...'}</p>
                            </div>
                            <div className="right">
                                <p className="balance">{Utils.formatCurrency(account.balance, 2)} EM</p>
                                <div onClick={() => this.onDeleteAccount(account.address)} className="delete"><img src={DeleteIcon}></img></div>
                            </div>
                        </li>
                    })}

                    <li className="import-wallet">
                        <div onClick={() => this.onClickCreateWallet()}>
                            <img className="img-circle" src={CreateIcon}></img>
                            <p className="create">Create Wallet</p>
                        </div>
                        <div onClick={() => this.onClickImportWallet()}>
                            <p className="import">Import Wallet</p>
                            <img className="img-circle" src={RestoreIcon}></img>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }

    renderContent() {

        const { showSwitchWallet } = this.state
        var { setting, accountInfo } = this.props
        accountInfo = accountInfo || {}
        let gasPercent = (accountInfo.gasLimit - accountInfo.gasUsed) / accountInfo.gasLimit * 100
        let ramEMPercent = (accountInfo.ramLimit - accountInfo.ramUsed) / accountInfo.ramLimit * 100

        return (
            <div className="right-panel" id="home">
                <div className="waper-header">
                    <div className="header">
                        <img onClick={() => this.showSearch()} src={IconSearch} className="btn-search"></img>

                        <div className="switch-wallet" onClick={() => this.setState({ showSwitchWallet: !showSwitchWallet })}>
                            <p className="title">Switch Wallet <img className="arrow-down" src={ArrowDown}></img></p>
                        </div>

                        {showSwitchWallet && this.renderListWallet()}

                        <div className="header-right">
                            <img style={{ cursor: "pointer" }} onClick={() => this.showSetting()} src={IconSetting}></img>
                        </div>
                    </div>
                    <div className="titler">
                        <p className="balance">{Utils.formatCurrency(accountInfo.balance, 8)} EM</p>
                        {/* <p>{CURRENCY_SYMBOL[setting.currency.toUpperCase()]} {parseFloat(accountInfo.balance * accountInfo.marketData[setting.currency]).toFixed(2).toString()}</p> */}
                        <p style={{ fontSize: '14px', marginTop: 10 }}>{accountInfo.username}</p>
                        <p style={{ fontSize: '10px' }}>{accountInfo.address}</p>
                        {/* <div className="copy-with-text">
                            <ButtonCopy copyText={accountInfo.address} />
                            <span>COPY</span>
                        </div> */}
                    </div>
                </div>

                <div className="waper-button">
                    <button onClick={() => this.togglePopup('showReceive')}>Receive</button>
                    <button onClick={() => this.togglePopup('showSend')}>Send</button>
                </div>

                <div className="waper-group2">
                    <button style={{ width: '49%' }} onClick={() => this.togglePopup('showGas')}>
                        <div className={`percent ${gasPercent <= 10 ? 'percent-red' : ''}`} style={{ width: `${gasPercent}%` }} ></div>
                        <p>GAS</p>
                        <p>{gasPercent.toFixed(2)}%</p>
                    </button>
                    <button style={{ width: '49%' }} onClick={() => this.togglePopup('showRamEM')}>
                        <div className={`percent ${ramEMPercent <= 10 ? 'percent-red' : ''}`} style={{ width: `${ramEMPercent}%` }}></div>
                        <p>RAM</p>
                        <p>{ramEMPercent.toFixed(2)}%</p>
                    </button>
                </div>
                {this.renderListCoin()}
                {this.state.showRamEM && this.renderRam()}
                {this.state.showGas && this.renderStake()}
                {this.state.showReceive && this.renderReceive()}
                {this.state.showSend && this.renderSend()}
                {this.state.showTransactionSuccess && this.renderTransactionSuccess()}
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