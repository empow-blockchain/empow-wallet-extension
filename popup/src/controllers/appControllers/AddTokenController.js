import React, { Component } from 'react'
import IconSearch from '../../assets/images/icon-search.svg'
import Select from 'react-select'
import ArrowLeft from '../../assets/images/arrow-left.svg'
import Button from '../../components/Button'

import PopupAPI from 'popup/PopupAPI'

class AddTokenController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [
                { label: 'ERC20', value: 0 },
                { label: 'TRC20', value: 1 },
                { label: 'EOSTOKEN', value: 2 }
            ],
            defaultValue: { label: 'ERC20', value: 0 },
            contractAddress: '',
            name: '',
            symbol: '',
            decimal: '',
            loading: false,
            error: false,
            success: false,
        };
    };

    handleChangeSelect = (value) => {
        this.setState({
            defaultValue: value
        })
    }

    onSave = () => {
        const { contractAddress, name, symbol, decimal, defaultValue } = this.state

        this.setState({
            error: false,
            success: false,
            loading: true
        })

        PopupAPI.addToken(defaultValue.label, contractAddress, name, symbol, decimal).then(res => {

            this.setState({
                error: false,
                success: 'Add Token Successful',
                loading: false
            })

        }).catch(error => {
            this.setState({
                error,
                success: false,
                loading: false
            })
        })
    }

    render() {
        return (
            <div className="right-panel bg-general" id="add-token">
                <div className="header">
                    <img onClick={this.props.onBack} src={ArrowLeft} className="btn-back"></img>
                </div>

                <div className="wrapper">
                    {this.state.success && <div className="alert alert-success">{this.state.success}</div>}
                    {this.state.error && <div className="alert">{this.state.error}</div>}

                    <div className="group">
                        <p>Add Token</p>
                        <div className="select">
                            <Select className="react-select-container" classNamePrefix="react-select"
                                isSearchable={false}
                                options={this.state.data}
                                value={this.state.defaultValue}
                                onChange={(value) => this.handleChangeSelect(value)}
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: '40px' }}>
                        <div className="one-input">
                            <p>Smart contract address</p>
                            <input type="text" name="contractAddress" onBlur={(e) => this.setState({ [e.target.name]: e.target.value })}></input>
                        </div>
                        <div className="one-input">
                            <p>Token Name</p>
                            <input type="text" name="name" onBlur={(e) => this.setState({ [e.target.name]: e.target.value })}></input>
                        </div>
                        <div className="one-input">
                            <p>Token Symbol</p>
                            <input type="text" name="symbol" onBlur={(e) => this.setState({ [e.target.name]: e.target.value })}></input>
                        </div>
                        <div className="one-input">
                            <p>Decimal</p>
                            <input type="text" name="decimal" onBlur={(e) => this.setState({ [e.target.name]: e.target.value })}></input>
                        </div>

                    </div>
                    <Button isLoading={this.state.loading} onClick={this.onSave}>Save</Button>
                </div>
            </div>
        );
    }
}

export default AddTokenController;