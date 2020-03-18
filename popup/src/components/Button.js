import React from 'react';
import LoadingIcon from './../assets/images/loading.svg'

const Button = props => {

    const {
        children,
        onClick = () => {},
        isLoading
    } = props;

    return (
        <button className={`btn-general bg-btn-general ${isLoading ? 'btn-loading' : ''}`} onClick={onClick}>
            {isLoading && <img src={LoadingIcon}/>}
            {isLoading ? <span>{children}</span> : children}
        </button>
    );
};

export default Button;