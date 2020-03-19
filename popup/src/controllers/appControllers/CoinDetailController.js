import React, { Component } from 'react'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import IconEmpty from '../../assets/images/icon-empty.svg'
import PopupAPI from '../../PopupAPI';
import Utils from 'lib/utils'
import { NODE, APP_STATE } from 'constants/index'

class CoinDetailController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            transactionFilter: 'all',
            histories: [],
        };
    };

    async componentDidMount() {
        PopupAPI.getTransactionHistories(this.props.accountInfo).then(res => {
            this.setState({
                histories: res
            })
        })
    }

    onClickBack = () => {
        PopupAPI.setAppState(APP_STATE.READY)
    }

    renderListTransactions() {

        const { accountInfo, setting } = this.props
        const { histories, transactionFilter } = this.state

        var selectedNetwork = setting.networks.find(x => x.selected === true)
        var txURL = selectedNetwork.txUrl
       
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
                            <a href={`${txURL}/${value.txid}`} target="_blank" className="content">
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
        return (
            <div className="right-panel bg-general" id="coin-detail">
                <div>
                    <img src={ArrowLeft} className="btn-back" onClick={() => this.onClickBack()}></img>
                </div>
                {this.renderListTransactions()}
            </div>
        );
    }
}

export default CoinDetailController;