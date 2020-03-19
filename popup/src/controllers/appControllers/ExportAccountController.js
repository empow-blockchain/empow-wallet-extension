import React, { Component } from 'react'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import IconSearch from '../../assets/images/icon-search.svg'
import IconCopy from '../../assets/images/icon-copy.svg'
import ButtonCopy from '../../components/ButtonCopy'
import CoinIcon from '../../components/CoinIcon'
import Logo from '../../assets/images/logo.svg'
import Button from '../../components/Button'
import PopupAPI from '../../PopupAPI';

class ExportAccountController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filterResult: props.accounts,
            ready: false,
            password: '',
            error: false
        }
    }

    onSearch = (e) => {
        const { accounts } = this.props
        let query = e.target.value
        query = query.trim().toLowerCase()

        let result = []

        if (query.trim() == '') {
            this.setState({
                filterResult: accounts
            })
        } else {
            accounts.map((value, index) => {
                var key = value.username || value.address
                if (key.toLowerCase().search(query) != -1) {
                    result.push(Object.assign(value, { index }))
                }
            })

            this.setState({
                filterResult: result
            })
        }
    }

    onSubmit = (e) => {

        e.preventDefault()

        this.setState({
            error: false
        })

        PopupAPI.checkPassword(this.state.password).then(res => {
            this.setState({
                ready: true
            })
        }).catch(error => {
            this.setState({
                error
            })
        })
    }

    renderPassword() {
        return (
            <div className="right-panel bg-login" id="register">
                <div style={{ textAlign: 'left' }}>
                    <img src={ArrowLeft} className="btn-back" onClick={this.props.onBack}></img>
                </div>
                <img src={Logo} className="logo"></img>
                <form>
                    {this.state.error && <div className="alert">{this.state.error}</div>}
                    <div>
                        <div className="one-input">
                            <p>Type your password</p>
                            <input type={this.state.showPassword ? "text" : "password"} name="password" onChange={(e) => this.setState({ password: e.target.value })}></input>
                        </div>
                    </div>
                    <Button onClick={this.onSubmit}>Continue</Button>
                </form>
            </div>
        )
    }

    renderExport() {

        const { accounts } = this.props
        const { filterResult } = this.state

        return (
            <div className="right-panel bg-general" id="export-account">
                <div>
                    <img onClick={this.props.onBack} src={ArrowLeft} className="btn-back"></img>
                    <div className="input-search" style={{ float: 'right' }}>
                        <img src={IconSearch}></img>
                        <input placeholder="Search" onChange={this.onSearch}></input>
                    </div>
                </div>

                <ul className="menu-general-3 scroll">
                    {filterResult.map((value, index) => {

                        var key = value.username || `Wallet ${index + 1}`
                        return (
                            <li>
                                <div className="group">
                                    <div className="waper">
                                        <p>Name</p>
                                        <div className="key">
                                            <p>{key}</p>
                                            <ButtonCopy copyText={value.address}></ButtonCopy>
                                        </div>
                                    </div>

                                    <div className="waper">
                                        <p>Address</p>
                                        <div className="key">
                                            <p>{value.address.length <= 25 ? value.address : value.address.substring(0, 25) + '...'}</p>
                                            <ButtonCopy copyText={value.address}></ButtonCopy>
                                        </div>
                                    </div>

                                    <div className="waper">
                                        <p>Private Key</p>
                                        <div className="key">
                                            <p>{value.privateKey.length <= 25 ? value.privateKey : value.privateKey.substring(0, 25) + '...'}</p>
                                            <ButtonCopy copyText={value.privateKey}></ButtonCopy>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }

    render() {
        const { ready } = this.state

        if (ready) return this.renderExport()

        return this.renderPassword()
    }
}

export default ExportAccountController;