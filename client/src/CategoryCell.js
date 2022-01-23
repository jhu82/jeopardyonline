import React from 'react';
import Cell from './Cell';
import styles from './Cell.module.css';

export default function CategoryCell({ value }) {

    return (
        <Cell className={styles['cell']}>
            <h1>{value}</h1>
        </Cell>
    )
}