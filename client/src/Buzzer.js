import React from 'react';
import styles from './Buzzer.module.css';

export default function Buzzer({ handleClick, enabled }) {
    return (
        <>
            { enabled && <div className={styles['buzzer']} onClick={handleClick} /> }
        </>
    )
}