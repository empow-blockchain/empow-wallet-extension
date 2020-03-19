import React, { Component } from 'react'
import IconSearch from '../../assets/images/icon-search.svg'
import IconMinue from '../../assets/images/icon-minue.svg'
import Switch from '../../components/Switch';
import CoinIcon from '../../components/CoinIcon'
import PopupAPI from 'popup/PopupAPI'
import { APP_STATE } from '../../../../constants';

class SearchController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filterResult: [this.props.accountInfo]
        }
    }

    onClick = (index) => {
        const { filterResult } = this.state
        const coinIndex = filterResult[index].index ? filterResult[index].index : index
        PopupAPI.setSelectedCoin(coinIndex)
        PopupAPI.setAppState(APP_STATE.READY)
    }

    onToggle = (symbol) => {
        let { listCoinDisabled } = this.props.setting

        if (!listCoinDisabled.hasOwnProperty(symbol)) {
            listCoinDisabled[symbol] = true
        } else {
            listCoinDisabled[symbol] = !listCoinDisabled[symbol]
        }

        this.setState({
            listCoinDisabled
        })

        PopupAPI.setSetting('listCoinDisabled', listCoinDisabled)
    }

    onBack = () => {
        PopupAPI.setAppState(APP_STATE.READY)
    }

    renderListCoin() {

        const { filterResult } = this.state
        const { showZeroBalance, listCoinDisabled } = this.props.setting



        return (
            <ul className="menu-general-2 scroll">
                {filterResult.map((value, index) => {

                    let isEnabled = true;
                    // if(!showZeroBalance && (value.balance == 0 || !value.balance)) return;
                    // if(listCoinDisabled.hasOwnProperty(value.symbol.toLowerCase())) isEnabled = !listCoinDisabled[value.symbol.toLowerCase()]

                    // if (value.customToken || value.type == 'BEP2') {
                    //     value.logo = `logo_${value.type.toLowerCase()}`
                    // } else {
                    //     value.logo = `logo_${value.symbol.toLowerCase()}`
                    // }

                    return (
                        <li key={index}>
                            {value.type == 'coin' ?
                                <div className={`logo-square logo-empow`} onClick={() => this.onClick(index)}>
                                    <img src={CoinIcon['empow']}></img>
                                </div>
                                :
                                <div className="logo-token" onClick={() => this.onClick(index)}>
                                    <img src={CoinIcon['empow']}></img>
                                </div>
                            }

                            <div className="content" onClick={() => this.onClick(index)}>
                                <p>EMPOW</p>
                                <p>{value.balance} EM</p>
                            </div>
                            <Switch defaultValue={isEnabled} onChange={() => this.onToggle(value.symbol.toLowerCase())}></Switch>
                        </li>
                    )
                })}
            </ul>
        )
    }

    onSearch = (e) => {
        const { accountInfo } = this.props
        let query = e.target.value
        query = query.trim().toLowerCase()

        let result = []

        if (query.trim() == '') {
            this.setState({
                filterResult: accountInfo
            })
        } else {
            accountInfo.map((value, index) => {
                if (value.name.toLowerCase().search(query) != -1 || value.symbol.toLowerCase().search(query) != -1) {
                    result.push(Object.assign(value, { index }))
                }
            })

            this.setState({
                filterResult: result
            })
        }
    }

    toggleZeroBalance = () => {

        const { showZeroBalance } = this.props.setting

        PopupAPI.setSetting('showZeroBalance', !showZeroBalance)
    }

    render() {

        const { accountInfo } = this.props
        const { showZeroBalance } = this.props.setting

        return (
            <div className="right-panel bg-general" id="search">
                <div className="input-search">
                    <img src={IconSearch}></img>
                    <input placeholder="Search" onChange={this.onSearch}></input>
                    <p onClick={this.onBack}>Cancel</p>
                </div>
                <div className="group" onClick={this.toggleZeroBalance}>
                    <p>{showZeroBalance ? 'Hide zero balances' : 'Show zero balances'}</p>
                    <div className="icon-circle">
                        <img src={IconMinue} ></img>
                    </div>
                </div>
                {this.renderListCoin()}
            </div>
        );
    }
}

export default SearchController;