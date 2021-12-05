import React from 'react';
import styles from './Cell.module.css';

export default function Cell({ name }) {
    return (
        <div className={styles['cell']}>
            <h1>{name}</h1>
        </div>
    )
}