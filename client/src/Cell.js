import React, { useState } from 'react';
import Question from './Question.js';
import styles from './Cell.module.css';

export default function Cell({ question, type, value }) {
    const [clicked, setClicked] = useState(false);
    const [answered, setAnswered] = useState(false);

    const handleClick = () => {
        if (type === 'category') return;
        if (!answered) {
            setClicked(!clicked);
            setAnswered(true);
        } else {
            setClicked(false);
        }
    }
    return (
        <div className={clicked ? `${styles['cell']} ${styles['fullscreen']}` : styles['cell']} onClick={handleClick}>
            <h1>{!clicked && !answered && value}</h1>
            {clicked && <Question question={question} />}
        </div>
    )
}