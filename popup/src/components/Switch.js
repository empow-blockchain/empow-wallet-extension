import React from 'react';

const Switch = props => {

    return (
        <label className="switch">
            <input type="checkbox" defaultChecked={props.defaultValue ? props.defaultValue : false} onChange={props.onChange}></input>
            <span></span>
        </label>
    );
};

export default Switch;