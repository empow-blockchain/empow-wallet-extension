import React, { Component } from 'react'
import Select from 'react-select'
import CoinIcon from '../../components/CoinIcon'
import PopupAPI from 'popup/PopupAPI'

class SignTransactionController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [
                { label: "Don't automatically sign", value: 0 },
                { label: 'For fifteen minutes', value: 15 * 60 * 1000 },
                { label: 'For thirty minutes', value: 30 * 60 * 1000},
                { label: 'For one hour', value: 60 * 60 * 1000},
                { label: 'For one day', value: 24 * 60 * 60 * 1000},
            ],
            defaultValue: { label: "Don't automatically sign", value: 0 },
            status: false,
            checked: false
        };
    }

    handleChangeSelect = (value) => {
        this.setState({
            defaultValue: value
        })
    }

    onAccept = () => {
        const { defaultValue } = this.state
        const now = new Date().getTime()
        let timeExpired = now + defaultValue.value
        if(this.state.checked) timeExpired = -1
        if(defaultValue.value == 0) timeExpired = 0
        PopupAPI.acceptTransaction(timeExpired)
    }

    renderSignTransaction() {

        const { transaction } = this.props

        return (
            <React.Fragment>
                <div className="group">
                    <div className={`logo-circle logo-${transaction.coin}`}>
                        <img src={CoinIcon[transaction.coin]}></img>
                    </div>
                    <div className="wrapper">
                        <p className="title">Sign Transaction</p>
                        <h3>{transaction.coin.toUpperCase()}</h3>
                    </div>
                </div>
                <div className="waperTextarea">
                    <textarea style={ {fontFamily: 'Courier New'} } className="scroll" disabled spellCheck="false" rows="4" defaultValue={transaction.message}></textarea>
                </div>
            </React.Fragment>
        )
    }

    renderSendTransaction() {

        const {transaction} = this.props

        return (
            <React.Fragment>
                <div className="group">
                    <div className={`logo-circle logo-${transaction.coin}`}>
                        <img src={CoinIcon[transaction.coin]}></img>
                    </div>
                    <div className="wrapper">
                        <p className="title">Send Transaction</p>
                        <h3>{transaction.coin.toUpperCase()}</h3>
                        <div className="waper" style={{ marginBottom: '15px' }}>
                            <p>Address</p>
                            <p>{transaction.contractAddress.length <= 20 ? transaction.contractAddress : transaction.contractAddress.substring(0,20) + '...'}</p>
                        </div>
                        <div className="waper">
                            <p>Amount</p>
                            <p>{transaction.amount} {transaction.symbol}</p>
                        </div>
                    </div>
                </div>

                { transaction.json &&
                    <div className="group scroll" style={ { maxHeight: 260, overflowY: 'auto' } }>
                        <pre style={ {fontFamily: 'Courier New'} }>{JSON.stringify(transaction.json, undefined, 1)}</pre>
                    </div>
                }

                { !transaction.hideWhitelist &&
                    <div className="group group-2">
                        <p className="text">Enable automatic signing.<br />
                            This allows Empow to automatically sign similar transactions on your behelf</p>
                        <div className="select">
                            <Select className="react-select-container" classNamePrefix="react-select"
                                isSearchable={false}
                                options={this.state.data}
                                value={this.state.defaultValue}
                                onChange={(value) => this.handleChangeSelect(value)}
                            />
                        </div>
                        <div className="waper-checkbox">
                            <label className="checkbox">
                                <input type="checkbox" onChange={() => this.setState({checked: !this.state.checked})} checked={this.state.checked}/>
                                <span className="checkmark"></span>
                            </label>
                            <p className="text">Add the app to the while list so it will be authenticated automatically. The pop-up window will also stop showing.</p>
                        </div>
                    </div>
                }
            </React.Fragment>
        )

    }

    render() {

        const { transaction } = this.props

        return (
            <div className="right-panel bg-general" id="sign-transaction">
                {transaction.type == 'send' ? this.renderSendTransaction() : this.renderSignTransaction()}
                <div className="waper-button">
                    <button onClick={() => PopupAPI.rejectTransaction()}>Reject</button>
                    <button onClick={() => this.onAccept()}>Accept</button>
                </div>
            </div>
        )
    }
}

export default SignTransactionController;