import React, { Component } from 'react'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import IconEmpty from '../../assets/images/icon-empty.svg'
import IconClose from '../../assets/images/icon-close.svg'
import IconCopy2 from '../../assets/images/icon-copy2.svg'
import Button from '../../components/Button'
import ButtonCopy from '../../components/ButtonCopy';
import Slider from 'react-rangeslider'
import Select from 'react-select';
import PopupAPI from '../../PopupAPI';
import Utils from 'lib/utils'
import ImgTransactionSuccess from '../../assets/images/img-transaction-success.svg'
import CoinIcon from '../../components/CoinIcon'

import { TX_API, CURRENCY_SYMBOL } from 'constants/index'

import { QRCode } from "react-qr-svg";
import '../../assets/css/rangeslider.css';

class CoinDetailController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            transactionFilter: 'all',
            defaultMenuStake: 1,
            defaultMenuRam: 1,
            defaultValueRam: { label: 'Bytes', value: 0 },
            showReceive: false,
            showSend: false,
            showStake: false,
            showRam: false,
            showRamEM: false,
            showGas: false,
            showTransactionSuccess: false,
            valueStakeCPU: 500,
            valueStakeNET: 700,
            histories: [],
            sendTo: '',
            sendAmount: 0,
            sendMemo: '',
            sendLoading: false,
            sendError: false,
            sendSuccess: false,
            avaiableEos: props.accountInfo.balance,
            reclaimingEOS: 0,
            buyRamValue: 0,
            sellRamValue: 0,
            stakeCpuValue: 0,
            stakeNetValue: 0,
            unstakeCpuValue: 0,
            unstakeNetValue: 0
        };
    };

    componentDidMount() {
        PopupAPI.getTransactionHistories(this.props.accountInfo).then(res => {
            this.setState({
                histories: res
            })
        }).catch(error => {
            console.log("ERROR" + error);
        })
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

    togglePopup = (name) => {
        this.setState({
            [name]: !this.state[name]
        })
    }

    onChangeSliderStake = (value, index) => {
        if (index === 1) {
            this.setState({
                valueStakeCPU: value
            })
        }

        if (index === 2) {
            this.setState({
                valueStakeNET: value
            })
        }
    }

    handleChangeSelectRam = (value) => {
        this.setState({
            defaultValueRam: value
        })
    }

    onClickBack = () => {
        PopupAPI.setSelectedCoin(false)
    }

    onBlurInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSend = () => {

        const { accountInfo } = this.props
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

    renderRam() {
        var show = 'showRamEM';
        const { avaiableEos, buyRamValue, sellRamValue, defaultMenuRam, reclaimingEOS, sendLoading, sendError } = this.state
        const { ramPrice, balance, ramLimit, ramUsed } = this.props.accountInfo

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

    renderTransactionSuccess() {

        const { accountInfo } = this.props
        const { sendSuccess } = this.state

        let txURL = ''

        if (accountInfo.type == 'coin') {
            txURL = TX_API[accountInfo.name.toUpperCase()] + sendSuccess
        } else {
            txURL = TX_API[accountInfo.type.toUpperCase()] + sendSuccess
        }

        if (sendSuccess == 'SenSend Transaction successfully') txURL = '#'

        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range" onClick={() => this.togglePopup('showSend')}></div>
                    <div className="transaction-success">
                        <img src={IconClose} className="icon-close" onClick={() => this.togglePopup('showTransactionSuccess')}></img>
                        <p className="title">Transaction success</p>
                        <img src={ImgTransactionSuccess}></img>
                        <p className="text">Click link below</p>
                        <a target="_blank" href={txURL}>{sendSuccess <= 30 ? sendSuccess : sendSuccess.substring(0, 30) + '...'}</a>
                        <p></p>
                    </div>
                </div>
            </div>
        )
    }

    renderListTransactions() {

        const { accountInfo } = this.props
        const { histories, transactionFilter } = this.state

        if (!histories) return;

        let listTransaction = []

        if (transactionFilter == 'all') {
            listTransaction = histories
        } else {
            for (var i = 0; i < histories.length; i++) {
                if (histories[i].type == transactionFilter) {
                    listTransaction.push(histories[i])
                }
            }
        }

        let txURL = ''

        if (accountInfo.type == 'coin') {
            txURL = TX_API[accountInfo.name.toUpperCase()]
        } else {
            txURL = TX_API[accountInfo.type.toUpperCase()]
        }

        return (
            <div className="waper-group3">
                <h1>Transactions</h1>
                <div className="menu">
                    <div className={this.state.transactionFilter == 'all' ? "child active" : "child"}>
                        <p onClick={() => this.setState({ transactionFilter: 'all' })}>All</p>
                    </div>
                    <div className={this.state.transactionFilter == 'receive' ? "child active" : "child"}>
                        <p onClick={() => this.setState({ transactionFilter: 'receive' })}>Receive</p>
                    </div>
                    <div className={this.state.transactionFilter == 'send' ? "child active" : "child"}>
                        <p onClick={() => this.setState({ transactionFilter: 'send' })}>Send</p>
                    </div>
                </div>

                {histories.length == 0 &&
                    <div className="empty">
                        <img src={IconEmpty}></img>
                        <p>No Transaction</p>
                    </div>
                }

                {histories.length > 0 && <ul className="scroll">
                    {listTransaction.map((value, index) => {
                        return (<li key={index}>
                            <a href={txURL + value.txid} target="_blank" className="content">
                                <p>{value.address.length > 24 ? value.address.substring(0, 24) + '...' : value.address}</p>
                                <p className="time">{typeof value.time == 'number' ? Utils.formatTime(value.time) : value.time}</p>
                            </a>
                            <div className="content">
                                {value.type == 'receive' && <p style={{ color: '#6ae82d' }}>+{parseFloat(parseFloat(value.value).toFixed(8)).toString()}</p>}
                                {value.type == 'send' && <p style={{ color: '#e74c3c' }}>-{parseFloat(parseFloat(value.value).toFixed(8)).toString()}</p>}
                                <p>{accountInfo.symbol}</p>
                            </div>
                        </li>)
                    })}
                </ul>}

            </div>
        )
    }

    render() {
        if (!this.props.accountInfo) return this.onClickBack()
        const { accountInfo, setting } = this.props

        let gasPercent = 0
        let ramEMPercent = 0

        if (accountInfo.name == 'EMPOW') {
            gasPercent = (accountInfo.gasLimit - accountInfo.gasUsed) / accountInfo.gasLimit * 100
            ramEMPercent = (accountInfo.ramLimit - accountInfo.ramUsed) / accountInfo.ramLimit * 100
        }

        if (accountInfo.customToken || accountInfo.type == 'BEP2') {
            accountInfo.logo = `logo_${accountInfo.type.toLowerCase()}`
        } else {
            accountInfo.logo = `logo_${accountInfo.symbol.toLowerCase()}`
        }

        return (
            <div className="right-panel bg-general" id="coin-detail">
                <div>
                    <img src={ArrowLeft} className="btn-back" onClick={() => this.onClickBack()}></img>
                </div>

                <div className="waper-group1">
                    <div className="top">
                        <div className="logo-token">
                            <img className="ava" src={CoinIcon[accountInfo.logo]}></img>
                        </div>

                        <div className="content" style={{ width: '100px' }}>
                            <p>{accountInfo.name.length <= 8 ? accountInfo.name : accountInfo.name.substring(0, 8) + '...'}</p>
                            <p>{accountInfo.symbol}</p>
                        </div>
                        <div className="content" style={{ textAlign: 'right' }}>
                            <p>{Utils.formatCurrency(accountInfo.balance)} {accountInfo.symbol}</p>
                            <p>{CURRENCY_SYMBOL[setting.currency.toUpperCase()]} {parseFloat(accountInfo.balance * accountInfo.marketData[setting.currency]).toFixed(2).toString()}</p>
                        </div>
                    </div>
                    <div className="center">
                        <p className="address">{accountInfo.address}</p>
                        <ButtonCopy copyText={accountInfo.address} />
                    </div>

                    <div className="waper-button">
                        <button onClick={() => this.togglePopup('showReceive')}>Receive</button>
                        <button onClick={() => this.togglePopup('showSend')}>Send</button>
                    </div>
                </div>

                {accountInfo.name == 'EMPOW' &&
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
                }

                {this.renderListTransactions()}
                {this.state.showReceive && this.renderReceive()}
                {this.state.showSend && this.renderSend()}
                {this.state.showRamEM && this.renderRam()}
                {this.state.showGas && this.renderStake()}
                {this.state.showTransactionSuccess && this.renderTransactionSuccess()}
            </div>
        );
    }
}

export default CoinDetailController;