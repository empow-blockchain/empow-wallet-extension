import React, {Component} from 'react'
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
            filterResult: props.accountInfo,
            ready: false,
            password: '',
            error:false
        }
    }

    onSearch = (e) => {
        const { accountInfo } = this.props
        let query = e.target.value
        query = query.trim().toLowerCase()

        let result = []

        if(query.trim() == '') {
            this.setState({
                filterResult: accountInfo
            })
        } else {
            accountInfo.map( (value, index) => {
                if(value.name.toLowerCase().search(query) != -1 || value.symbol.toLowerCase().search(query) != -1) {
                    result.push(Object.assign(value, {index}))
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

    renderPassword () {
        return (
            <div className="right-panel bg-login" id="register">
                <div style={ {textAlign: 'left'} }>
                    <img src={ArrowLeft} className="btn-back" onClick={this.props.onBack}></img>
                </div>
                <img src={Logo} className="logo"></img>
                <form>
                    { this.state.error && <div className="alert">{this.state.error}</div>}
                    <div>
                        <div className="one-input">
                            <p>Type your password</p>
                            <input type={this.state.showPassword ? "text" : "password"} name="password" onChange={(e) => this.setState({password: e.target.value})}></input>
                        </div>
                    </div>
                    <Button onClick={this.onSubmit}>Continue</Button>
                </form>
            </div>
        )
    }

    renderExport() {

        const { accountInfo } = this.props
        const { filterResult } = this.state

        return (
            <div className="right-panel bg-general" id="export-account">
                <div>
                    <img onClick={this.props.onBack} src={ArrowLeft} className="btn-back"></img>
                    <div className="input-search" style={{float: 'right'}}>
                        <img src={IconSearch}></img>
                        <input placeholder="Search" onChange={this.onSearch}></input>
                    </div>
                </div>

                <ul className="menu-general-3 scroll">
                    {filterResult.map( (value,index) => {

                        if (value.customToken || value.type == 'BEP2') {
                            value.logo = `logo_${value.type.toLowerCase()}`
                        } else {
                            value.logo = `logo_${value.symbol.toLowerCase()}`
                        }

                        return (
                            <li>
                                { value.type == 'coin' ? 
                                    <div className={`logo-circle logo-${value.name.toLowerCase()}`}>
                                        <img src={CoinIcon[value.name.toLowerCase()]}></img>
                                    </div>
                                :
                                    <div className="logo-token">
                                        <img src={CoinIcon[value.logo]}></img>
                                    </div>
                                }
                                <div className="content">
                                    <p>{value.name.length <= 8 ? value.name : value.name.substring(0,8) + '...'}</p>
                                    <p>{value.symbol}</p>
                                </div>
                                <div className="group">
                                    {value.publicKey && 
                                        <div className="waper">
                                            <p>Public Key</p>
                                            <div className="key">
                                                <p>{value.publicKey.length <= 16 ? value.publicKey : value.publicKey.substring(0,16) + '...'}</p>
                                                <ButtonCopy copyText={value.publicKey}></ButtonCopy>
                                            </div>
                                        </div>
                                    }
                                    <div className="waper">
                                        <p>Private Key</p>
                                        <div className="key">
                                            <p>{value.privateKey.length <= 16 ? value.privateKey : value.privateKey.substring(0,16) + '...'}</p>
                                            <ButtonCopy copyText={value.privateKey}></ButtonCopy>
                                        </div>
                                    </div>
                                    { value.ownerPublicKey &&
                                        <React.Fragment>
                                            <div className="waper">
                                                <p>Owner Public Key</p>
                                                <div className="key">
                                                    <p>{value.ownerPublicKey.length <= 16 ? value.ownerPublicKey : value.ownerPublicKey.substring(0,16) + '...'}</p>
                                                    <ButtonCopy copyText={value.ownerPublicKey}></ButtonCopy>
                                                </div>
                                            </div>
                                            <div className="waper">
                                                <p>Owner Private Key</p>
                                                <div className="key">
                                                    <p>{value.ownerPrivateKey.length <= 16 ? value.ownerPrivateKey : value.ownerPrivateKey.substring(0,16) + '...'}</p>
                                                    <ButtonCopy copyText={value.ownerPrivateKey}></ButtonCopy>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }

    render () {
        const { ready } = this.state

        if(ready) return this.renderExport()

        return this.renderPassword()
    }
}

export default ExportAccountController;