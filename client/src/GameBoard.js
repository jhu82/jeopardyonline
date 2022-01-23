import React from 'react';
import styles from './GameBoard.module.css';

export default function GameBoard({ categories, questions, users}) {
    return (
        <div className={styles['game-board']}>
            <div className={styles['category-row']}>
                {categories}
            </div>
            <div className={styles['questions']}>
                {questions}
            </div>
            <div className={styles['user-row']}>
                {users}
            </div>
        </div>
    )
}