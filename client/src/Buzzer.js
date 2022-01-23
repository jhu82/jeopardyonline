import React from 'react';
import styles from './Buzzer.module.css';

export default function Buzzer({ handleClick }) {
    return (
        <div className={styles['buzzer']} onClick={handleClick}></div>
    )
}