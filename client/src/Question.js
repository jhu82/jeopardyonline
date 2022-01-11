import React from 'react';
import styles from './Question.module.css';

export default function Question({ question }) {
    return (
        <div className={styles['question']}>
            {question.toUpperCase()}
        </div>
    )
}