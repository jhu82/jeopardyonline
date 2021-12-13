import React, { useState } from 'react';
import Question from './Question.js';
import styles from './Cell.module.css';

export default function Cell({ question, value }) {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        if (!clicked) setClicked(true);
        else setClicked(false);
    }
    return (
        <div className={styles['cell']} onClick={handleClick}>
            <h1>{!clicked && value}</h1>
            {clicked && <Question question={question} />}
        </div>
    )
}