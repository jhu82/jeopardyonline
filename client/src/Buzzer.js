import React from 'react';
import styles from './Buzzer.module.css';

export default function Buzzer({ handleClick, haveAnswered }) {
    return (
        <>
            { !haveAnswered && <div className={styles['buzzer']} onClick={handleClick} /> }
        </>
    )
}