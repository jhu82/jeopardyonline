import React from 'react';
import Cell from './Cell';
import styles from './Cell.module.css';

export default function QuestionCell({ value, onClick, question }) {
    return (
        <Cell className={styles['cell']} onClick={onClick}>
            <h1>{!question.answered && value}</h1>
        </Cell>
    )
}