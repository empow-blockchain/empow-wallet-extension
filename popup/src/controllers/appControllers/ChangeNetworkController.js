import React, { Component } from 'react'
import Select from 'react-select'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import Button from '../../components/Button'
import { NODE } from 'constants/index'

import CoinIcon from '../../components/CoinIcon'
import PopupAPI from 'popup/PopupAPI'

class ChangeNetworkController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            networks: props.networks
        }
    }

    onClick = (name) => {
        
        let { networks } = this.state

        for (let i = 0; i < networks.length; i++) { 
            networks[i].selected = false
            if (networks[i].name === name) {
                networks[i].selected = true
            }
        }

        this.setState({
            networks
        })
    }

    onSave = () => {
        PopupAPI.setSetting('networks', this.state.networks)
        this.props.onBackHome()
    }

    render() {
        const { networks} = this.state
        return (
            <div className="right-panel bg-general" id="change-network">
                <img onClick={this.props.onBack} src={ArrowLeft} className="btn-back"></img>
                <ul className="menu-general-2">

                    {networks.map((value, index) => {
                        return (
                            <li key={index} onClick={() => this.onClick(value.name)}>
                                <div className={`logo-square logo-empow`}>
                                    <img src={CoinIcon['empow']}></img>
                                </div>
                                <div className="content">
                                    <p style={{ textTransform: 'capitalize' }}>{value.name.toLowerCase()}</p>
                                    <p>url</p>
                                </div>
                                <label className="checkbox" style={{float: 'right'}}>
                                    <input type="radio" name="radio" checked={value.selected} />
                                    <span className="checkmark"></span>
                                </label>
                            </li>
                        )
                    })}
                </ul>
                <Button onClick={this.onSave}>Save</Button>
            </div>
        );
    }
}

export default ChangeNetworkController;