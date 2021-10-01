import React from 'react';
import style from './MyBtn.module.css';

const MyBtn = ({symbol, hh, mm, ss, ...props}) => {
    return (
        <div>
            <button {...props} className={style.view}>{symbol}</button>
        </div>
    );
};

export default MyBtn;