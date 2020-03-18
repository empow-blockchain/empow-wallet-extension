import React, {Component} from 'react'
import PopupAPI from 'popup/PopupAPI'
import Logo from '../../assets/images/logo.svg'
import PasswordView from '../../assets/images/password-view.svg'
import PasswordHide from '../../assets/images/password-hide.svg'
import Button from '../../components/Button'

class RegisterController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: '',
            repeatPassword: '',
            loading: false,
            error: false,
            showPassword1: false,
            showPassword2: false
        };

    };

    onChange = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        this.setState({
            [name]: value
        });
    }

    onSubmit = (e) => {
        e.preventDefault()

        const {password, repeatPassword} = this.state

        this.setState({
            error: false
        })

        if(password == '') return this.setState({error: 'Password require'})
        if(repeatPassword == '') return this.setState({error: 'Repeat password require'})
        if(password != repeatPassword) return this.setState({error: 'Repeat password not match with password'})

        this.setState({
            loading: true
        })

        PopupAPI.setPassword(password).catch((error) => {
            this.setState({
                loading: false,
                error
            })
        })

    }

    showHidePassword = (index) => {
        if (index === 1) {
            this.setState({
                showPassword1: !this.state.showPassword1
            })
        }

        if (index === 2) {
            this.setState({
                showPassword2: !this.state.showPassword2
            })
        }
    }

    render() {
        const {password, repeatPassword, error} = this.state;

        return (
            <div className="right-panel bg-login" id="register">
                <img src={Logo} className="logo"></img>
                <form>
                    { this.state.error && <div className="alert">{this.state.error}</div>}
                    <div>
                        <div className="one-input">
                            <p>New password</p>
                            <input type={this.state.showPassword1 ? "text" : "password"} name="password" onChange={this.onChange}></input>
                            { !this.state.showPassword1 && <img src={PasswordView} onClick={() => this.showHidePassword(1)}></img>}
                            { this.state.showPassword1 && <img src={PasswordHide} onClick={() => this.showHidePassword(1)}></img>}
                        </div>

                        <div className="one-input">
                            <p>Repeat new password</p>
                            <input type={this.state.showPassword2 ? "text" : "password"} name="repeatPassword" onChange={this.onChange}></input>
                            { !this.state.showPassword2 && <img src={PasswordView} onClick={() => this.showHidePassword(2)}></img>}
                            { this.state.showPassword2 && <img src={PasswordHide} onClick={() => this.showHidePassword(2)}></img>}
                        </div>
                    </div>
                    <Button onClick={this.onSubmit} isLoading={this.state.loading}>Continue</Button>
                </form>
            </div>
        );
    }
}

export default RegisterController;