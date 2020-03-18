import React, {Component} from 'react'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import Button from '../../components/Button'
import PopupAPI from 'popup/PopupAPI'
import { APP_STATE } from 'constants/index'

class RestoreWalletController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            loading: false,
            privateKey: '',
        };
    };

    onBack = (e) => {
        PopupAPI.setAppState(APP_STATE.UNLOCKED)
    }

    onSubmit = (e) => {
        e.preventDefault()

        if(!this.state.privateKey || this.state.privateKey.trim() == '') return this.setState({error: 'Private Key not blank'})

        this.setState({
            error: false,
            loading: true
        })

        setTimeout( () => { // wait for loading
            PopupAPI.restoreWallet(this.state.privateKey.trim()).catch(error => {
                this.setState({
                    loading: false,
                    error
                })
            })
        },1000)
    }

    render() {
        return (
            <div className="right-panel bg-login" id="restore-wallet">
                <img src={ArrowLeft} className="btn-back" onClick={(e) => this.onBack(e)}></img>
                <div className="wrapper">
                    { this.state.error && <div className="alert">{this.state.error}</div> }
                    <textarea spellCheck="false" placeholder="Private Key phrase" rows="4" onBlur={ (e) => this.setState({privateKey: e.target.value}) }></textarea>
                    <div className="alert alert-primary">Please enter your Private Key phrase below</div>
                    <Button onClick={(e) => this.onSubmit(e)} isLoading={this.state.loading}>Continue</Button>
                </div>
            </div>
        );
    }
}

export default RestoreWalletController;