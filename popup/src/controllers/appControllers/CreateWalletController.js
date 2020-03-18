import React, {Component} from 'react'
import IconCreate from '../../assets/images/icon-create.svg'
import IconRestore from '../../assets/images/icon-restore.svg'
import ArrowRight from '../../assets/images/arrow-right.svg'
import PopupAPI from 'popup/PopupAPI'
import { APP_STATE } from 'constants/index'

class CreateWalletController extends Component {

    constructor(props) {
        super(props);
    };

    onCreateNewWallet = () => {
        PopupAPI.setAppState(APP_STATE.CREATING)
    }

    onRestoreWallet = () => {
        PopupAPI.setAppState(APP_STATE.RESTORING)
    }

    render() {
        return (
            <div className="right-panel bg-login" id="create-wallet">
                <ul className="menu-general">
                    <li onClick={this.onCreateNewWallet}>
                        <img className="img-circle" src={IconCreate}></img>
                        <p className="title">Create new wallet</p>
                        <img src={ArrowRight} className="arrow-icon"></img>
                    </li>
                    <li onClick={this.onRestoreWallet}>
                        <img className="img-circle" src={IconRestore}></img>
                        <p className="title">Restore wallet</p>
                        <img src={ArrowRight} className="arrow-icon"></img>
                    </li>
                </ul>
            </div>
        );
    }
}

export default CreateWalletController;