import React, {Component} from 'react'
import Select from 'react-select'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import Button from '../../components/Button'
import { NODE } from 'constants/index'

import CoinIcon from '../../components/CoinIcon'
import PopupAPI from 'popup/PopupAPI'

class ChangeNetworkController extends Component {

    constructor(props) {
        super(props);

        let networkOption = []
        
        for(let key in NODE) {
            let object = {
                name: key,
                option: []
            }
            for(let key2 in NODE[key]) {
                object.option.push(key2)
            }

            networkOption.push(object)
        }

        this.state = {
            networkOption,
            defaultValue: props.network
        };
    }

    handleChangeSelect = (name, label) => {
        let { defaultValue } = this.state

        defaultValue[name] = label

        this.setState({
            defaultValue
        })
    }

    onSave = () => {
        PopupAPI.setSetting('network', this.state.defaultValue)
        this.props.onBackHome()
    }

    render() {

        const { networkOption,defaultValue } = this.state

        return (
            <div className="right-panel bg-general" id="change-network">
                <img onClick={this.props.onBack} src={ArrowLeft} className="btn-back"></img>
                <ul className="menu-general-2">

                    { networkOption.map((value,index) => {

                        let option = []
                        let selected = {}

                        for(let i = 0; i < value.option.length; i++) {
                            option[i] = {
                                label: value.option[i],
                                value: i
                            }

                            if(defaultValue[value.name] == option[i].label) {
                                selected = option[i]
                            }
                        }

                        return (
                            <li key={index}>
                                <div className={`logo-square logo-${value.name.toLowerCase()}`}>
                                    <img src={CoinIcon[value.name.toLowerCase()]}></img>
                                </div>
                                <div className="content">
                                    <p style={ { textTransform: 'capitalize' } }>{value.name.toLowerCase()}</p>
                                    <p>Default: Mainnet</p>
                                </div>
                                <div className="select">
                                    <Select className="react-select-container" classNamePrefix="react-select"
                                        isSearchable={false}
                                        options={option}
                                        value={selected}
                                        onChange={(select) => this.handleChangeSelect(value.name, select.label)}
                                    />
                                </div>
                            </li>
                        )
                    }) }
                </ul>
                <Button onClick={this.onSave}>Save</Button>
            </div>
        );
    }
}

export default ChangeNetworkController;