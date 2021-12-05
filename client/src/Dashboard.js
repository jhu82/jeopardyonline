import React from 'react';
import Cell from './Cell';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    const categories = ['a', 'b', 'c', 'd', 'e', 'f'];
    const values = [200, 400, 600, 800, 1000];
    const categoryRow = categories.map(category => {
                            return <Cell name={category} />
                        })
    const questions = values.map(value => {
        return <div className={styles['question-row']}>
            <Cell name={value} />
            <Cell name={value} />
            <Cell name={value} />
            <Cell name={value} />
            <Cell name={value} />
            <Cell name={value} />
        </div>
    })
    return (
    <div>
        <div className={styles['category-row']}>
            {categoryRow}
        </div>
        <div className="questions">
            {questions}
        </div>
    </div>)
}