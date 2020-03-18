import React, {Component} from 'react'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import Button from '../../components/Button'
import PasswordView from '../../assets/images/password-view.svg'
import PasswordHide from '../../assets/images/password-hide.svg'
import PopupAPI from '../../PopupAPI';

class ChangePasswordController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPassword1: false,
            showPassword2: false,
            showPassword3: false,
            oldPassword: '',
            newPassword: '',
            repeatPassword: '',
            loading : false,
            error: false,
        };
    };

    onBlurPassword = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        this.setState({
            [name]: value
        });
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

        if (index === 3) {
            this.setState({
                showPassword3: !this.state.showPassword3
            })
        }
    }

    onSubmit = (e) => {
        e.preventDefault()

        const {oldPassword, newPassword, repeatPassword} = this.state

        if(oldPassword.trim() == '' || 
            newPassword.trim() == '' || 
            repeatPassword.trim() == '' || 
            oldPassword.length == 0 || 
            newPassword.length == 0 || 
            repeatPassword.length == 0
        ) return this.setState({error: 'All input can\'t be blank'})
            
        if(newPassword != repeatPassword) return this.setState({error: 'Repeat password not correct'})

        this.setState({
            loading: true,
            error: false
        })

        PopupAPI.checkPassword(oldPassword).then(res => {
            PopupAPI.changePassword(newPassword)
        }).catch(error => {
            this.setState({
                loading: false,
                error
            })
        })
 
    }

    render() {
        return (
            <div className="right-panel bg-general" id="change-password">
                <img onClick={this.props.onBack} src={ArrowLeft} className="btn-back"></img>
                <form>
                    { this.state.error && <div className="alert">{this.state.error}</div> }
                    <div className="waper-input">
                        <div className="one-input">
                            <p>Old password</p>
                            <input type={this.state.showPassword1 ? "text" : "password"} name="oldPassword" onBlur={this.onBlurPassword}></input>
                            { !this.state.showPassword1 && <img src={PasswordView} onClick={() => this.showHidePassword(1)}></img>}
                            { this.state.showPassword1 && <img src={PasswordHide} onClick={() => this.showHidePassword(1)}></img>}
                        </div>

                        <div className="one-input">
                            <p>New password</p>
                            <input type={this.state.showPassword2 ? "text" : "password"} name="newPassword" onBlur={this.onBlurPassword}></input>
                            { !this.state.showPassword2 && <img src={PasswordView} onClick={() => this.showHidePassword(2)}></img>}
                            { this.state.showPassword2 && <img src={PasswordHide} onClick={() => this.showHidePassword(2)}></img>}
                        </div>

                        <div className="one-input">
                            <p>Repeat new password</p>
                            <input type={this.state.showPassword3 ? "text" : "password"} name="repeatPassword" onBlur={this.onBlurPassword}></input>
                            { !this.state.showPassword3 && <img src={PasswordView} onClick={() => this.showHidePassword(3)}></img>}
                            { this.state.showPassword3 && <img src={PasswordHide} onClick={() => this.showHidePassword(3)}></img>}
                        </div>
                    </div>
                    <Button onClick={this.onSubmit} isLoading={this.state.loading}>Confirm</Button>
                </form>
            </div>
        );
    }
}

export default ChangePasswordController;