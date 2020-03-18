import React, {Component} from 'react'
import IconCopy from '../../assets/images/icon-copy.svg'
import LoadingIcon from '../../assets/images/loading.svg'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import PopupAPI from 'popup/PopupAPI'
import Button from '../../components/Button'
import ButtonCopy from '../../components/ButtonCopy'
import { APP_STATE } from 'constants/index'

class CreateNewWalletController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            loading: true,
            privateKey: '',
        };
    };

    onBack = (e) => {
        PopupAPI.setAppState(APP_STATE.UNLOCKED)
    }

    onSubmit = (e) => {
        e.preventDefault()

        if(!this.state.privateKey || this.state.privateKey.trim() == '') return this.setState({error: 'Private key not blank'})

        this.setState({
            error: false,
            loading: true
        })

        PopupAPI.restoreWallet(this.state.privateKey.trim()).catch(error => {
            this.setState({
                loading: false,
                error
            })
        })
    }
    
    componentDidMount () {
        PopupAPI.createNewWallet().then(res => {
            console.log(res)
            this.setState({
                error: false,
                loading: false,
                privateKey: res.privateKey
            })
        })
    }

    renderLoading() {
        return (
            <div className="right-panel bg-login" id="create-new-wallet">
                <div className="loading">
                    <img src={LoadingIcon}/>
                    <p>Creating . . .</p>
                </div>
            </div>
        ) 
    }

    renderError () {
        return (
            <div className="right-panel bg-login" id="create-new-wallet">
                <div className="alert">{this.state.error}</div>
            </div>
        )
    }

    renderSuccess () {
        return (
            <div className="right-panel bg-login" id="create-new-wallet">
                <img src={ArrowLeft} className="btn-back" onClick={(e) => this.onBack(e)}></img>

                <div className="waperTextarea">
                    <textarea disabled spellCheck="false" placeholder="Private key phrase" rows="4" defaultValue={this.state.privateKey}></textarea>
                    <ButtonCopy copyText={this.state.privateKey}/>
                </div>
                
                <div className="alert alert-primary">Please write down Private Key Phrase and keep the copy in a secure place</div>
                <Button onClick={(e) => this.onSubmit(e)}>Continue</Button>
            </div>
        )
    }

    render() {
        if(this.state.loading) return this.renderLoading();
        if(this.state.error) return this.renderError();
        return this.renderSuccess()
    }
}

export default CreateNewWalletController;