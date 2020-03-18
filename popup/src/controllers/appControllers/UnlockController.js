import React from 'react'
import Logo from '../../assets/images/logo.svg'
import PasswordView from '../../assets/images/password-view.svg'
import PasswordHide from '../../assets/images/password-hide.svg'
import Button from '../../components/Button'
import PopupAPI from 'popup/PopupAPI'

class UnlockController extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            password: '',
            error: null,
            showPassword: false
        }
    }

    onChange = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        this.setState({
            [name]: value
        });
    }

    onSubmit = (e) => {

        e.preventDefault()
        
        const {password} = this.state

        PopupAPI.unlock(password).then().catch(error => {
            this.setState({
                error
            })
        })
    }

    showHidePassword = (index) => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    render() {
        return (
            <div className="right-panel bg-login" id="register">
                <img src={Logo} className="logo"></img>
                <form>
                    { this.state.error && <div className="alert">{this.state.error}</div>}
                    <div>
                        <div className="one-input">
                            <p>Unlock your wallet</p>
                            <input type={this.state.showPassword ? "text" : "password"} name="password" onChange={(e) => this.onChange(e)}></input>
                            { !this.state.showPassword && <img src={PasswordView} onClick={() => this.showHidePassword()}></img>}
                            { this.state.showPassword && <img src={PasswordHide} onClick={() => this.showHidePassword()}></img>}
                        </div>
                    </div>
                    <Button onClick={this.onSubmit} isLoading={this.state.loading}>Continue</Button>
                </form>
            </div>
        )
    }
}

export default UnlockController;