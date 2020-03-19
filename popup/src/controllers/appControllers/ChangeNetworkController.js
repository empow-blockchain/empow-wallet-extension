import React, { Component } from 'react'
import Select from 'react-select'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import CreateIcon from '../../assets/images/icon-create.svg'
import Button from '../../components/Button'
import { NODE } from 'constants/index'
import DeleteIcon from '../../assets/images/delete-icon.svg'
import CoinIcon from '../../components/CoinIcon'
import PopupAPI from 'popup/PopupAPI'
import Axios from 'axios';

class ChangeNetworkController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            networks: props.networks,
            name: '',
            nodeUrl: '',
            error: false
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

    onAddNote = async () => {
        var { networks, name, nodeUrl } = this.state

        this.setState({
            error: false
        })
        if (!name || !nodeUrl) {
            this.setState({
                error: 'Chua nhap du thong tin'
            })
            return
        }

        if (networks.find(x => x.url.toLowerCase() === nodeUrl.toLocaleLowerCase())) {
            this.setState({
                error: 'Dup Node URL'
            })
            return;
        }

        const res = await Axios.get(`${nodeUrl}/getChainInfo`)
        if (!res || !res.net_name) {
            this.setState({
                error: 'Wrong Node URL'
            })
            return;
        }

        var apiUrl = NODE.MAINNET.API_URL
        var txUrl = NODE.MAINNET.TX_URL
        if (res.net_name === 'testnet') {
            apiUrl = NODE.TESTNET.API_URL
            txUrl = NODE.TESTNET.TX_URL
        }

        PopupAPI.addNetwork({ name: this.state.name, url: this.state.nodeUrl, selected: true, apiUrl, txUrl })
        this.props.onBackHome()
    }

    onDeleteNode = (url) => {
        PopupAPI.deleteNetwork(url)
        this.props.onBackHome()
    }

    renderAddNode() {
        return (
            <div className="right-panel bg-general" id="add-node">
                <div className="header">
                    <img onClick={this.props.onBack} src={ArrowLeft} className="btn-back"></img>
                </div>
                <div className="wrapper">
                    <div style={{ marginBottom: '40px' }}>
                        <div className="one-input">
                            <p>Name</p>
                            <input type="text" name="name" onBlur={(e) => this.setState({ [e.target.name]: e.target.value })}></input>
                        </div>
                        <div className="one-input">
                            <p>Node URL</p>
                            <input type="text" name="nodeUrl" onBlur={(e) => this.setState({ [e.target.name]: e.target.value })}></input>
                        </div>

                    </div>
                    <Button isLoading={this.state.loading} onClick={this.onAddNote}>Save</Button>

                    {this.state.error && <div className="alert" style={{ marginTop: '10px' }}>{this.state.error}</div>}
                </div>


            </div>
        )
    }

    render() {
        const { networks, isShowAddNote } = this.state
        if (isShowAddNote) {
            return this.renderAddNode()
        }

        return (
            <div className="right-panel bg-general" id="change-network">
                <img onClick={this.props.onBack} src={ArrowLeft} className="btn-back"></img>
                <ul className="menu-general-2">
                    {networks.map((value, index) => {
                        return (
                            <li key={index} >
                                <div className={`logo-square logo-empow`}>
                                    <img src={CoinIcon['empow']}></img>
                                </div>
                                <div className="content">
                                    <p style={{ textTransform: 'capitalize' }}>{value.name.toLowerCase()}</p>
                                    <p>{value.url}</p>
                                </div>
                                <label className="checkbox" style={{ float: 'right' }} onClick={() => this.onClick(value.name)}>
                                    <input type="radio" name="radio" checked={value.selected} />
                                    <span className="checkmark"></span>
                                </label>
                                {(value.url !== NODE.MAINNET.URL && value.url !== NODE.TESTNET.URL) && <div onClick={() => this.onDeleteNode(value.url)} className="delete"><img src={DeleteIcon}></img></div>}
                            </li>
                        )
                    })}
                </ul>
                <div className="add-node" onClick={() => { this.setState({ isShowAddNote: true }) }}>
                    <img className="img-circle" src={CreateIcon}></img>
                    <p>Add Node</p>
                </div>
                <Button onClick={this.onSave}>Save</Button>
            </div>
        );
    }
}

export default ChangeNetworkController;