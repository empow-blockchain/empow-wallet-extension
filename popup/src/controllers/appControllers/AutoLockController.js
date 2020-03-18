import React, {Component} from 'react'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import PopupAPI from '../../PopupAPI';

class AutoLockController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            autolock: props.autolock,
            defaultValue: [false,false,false,false,false]
        }
    }

    componentDidMount () {
        $(`[value='${this.props.autolock}']`).prop('checked', true)
    }

    onClick = (e,autolock) => {
        PopupAPI.setSetting('autolock', autolock)
        $(e.target).find('input').prop('checked', true);
    }

    render() {

        const { defaultValue } = this.state

        return (
            <div className="right-panel bg-general" id="auto-lock">
                <img onClick={this.props.onBack} src={ArrowLeft} className="btn-back"></img>
                <ul className="menu-general">
                    <li>
                        <p className="title">1 min</p>
                        <label className="checkbox" onClick={(e) => this.onClick(e, 60000)}> 
                            <input type="radio" name="radio" value="60000"/>
                            <span className="checkmark"></span>
                        </label>
                    </li>
                    <li>
                        <p className="title">5 min</p>
                        <label className="checkbox" onClick={(e) => this.onClick(e, 300000)}>
                        <input type="radio" name="radio" value="300000"/>
                            <span className="checkmark"></span>
                        </label>
                    </li>
                    <li>
                        <p className="title">10 min</p>
                        <label className="checkbox" onClick={(e) => this.onClick(e, 2600000)}>
                        <input type="radio" name="radio" value="2600000"/>
                            <span className="checkmark"></span>
                        </label>
                    </li>
                    <li>
                        <p className="title">30 min</p>
                        <label className="checkbox" onClick={(e) => this.onClick(e, 31800000)}>
                            <input type="radio" name="radio" value="31800000"/>
                            <span className="checkmark"></span>
                        </label>
                    </li>
                    <li>
                        <p className="title">Never</p>
                        <label className="checkbox" onClick={(e) => this.onClick(e, 0)}>
                        <input type="radio" name="radio" value="0"/>
                            <span className="checkmark"></span>
                        </label>
                    </li>
                </ul>
            </div>
        );
    }
}

export default AutoLockController;