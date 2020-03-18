import React, {Component} from 'react'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import ArrowRight from '../../assets/images/arrow-right.svg'
import IconCurrency from '../../assets/images/icon-currency.svg'
import IconPound from '../../assets/images/icon-pound.svg'
import IconYen from '../../assets/images/icon-yen.svg'
import IconEuro from '../../assets/images/icon-euro.svg'
import PopupAPI from 'popup/PopupAPI'

class CurrencyController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currency: props.currency
        };
    }

    componentDidMount () {
        $(`[data-value='${this.state.currency}']`).prop('checked', true)
    }

    onClick = (e) => {

        this.setState({
            currency: $(e.target).data('value')
        })

        PopupAPI.setSetting('currency', $(e.target).data('value'))
    }

    render() {

        const { currency } = this.state

        return (
            <div className="right-panel bg-general" id="currency">
                <img onClick={this.props.onBack} src={ArrowLeft} className="btn-back"></img>
                <ul className="menu-general">
                    <li onClick={(e) => this.onClick(e)}>
                        <img className="img-circle" src={IconCurrency}></img>
                        <p className="title">USD</p>
                        <label className="checkbox">
                            <input type="radio" name="radio" data-value="usd"/>
                            <span className="checkmark"></span>
                        </label>
                    </li>
                    <li onClick={(e) => this.onClick(e)}>
                        <img className="img-circle" src={IconEuro}></img>
                        <p className="title">EURO</p>
                        <label className="checkbox">
                            <input type="radio" name="radio" data-value="eur"/>
                            <span className="checkmark"></span>
                        </label>
                    </li>
                    <li onClick={(e) => this.onClick(e)}>
                        <img className="img-circle" src={IconPound}></img>
                        <p className="title">POUND</p>
                        <label className="checkbox">
                            <input type="radio" name="radio" data-value="gbp"/>
                            <span className="checkmark"></span>
                        </label>
                    </li>
                    <li onClick={(e) => this.onClick(e)}>
                        <img className="img-circle" src={IconYen}></img>
                        <p className="title">YEN</p>
                        <label className="checkbox">
                            <input type="radio" name="radio" data-value="jpy"/>
                            <span className="checkmark"></span>
                        </label>
                    </li>
                </ul>
            </div>
        );
    }
}

export default CurrencyController;