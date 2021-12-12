import React from 'react';
import Question from './Question.js';
import styles from './Cell.module.css';

export default function Cell({ question, value }) {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(true);
    }
    return (
        <div className={styles['cell']} onClick={handleClick()}>
            <h1>{value}</h1>
            {clicked && <Question question={question} />}
        </div>
    )
}