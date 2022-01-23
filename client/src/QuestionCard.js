import React, { useState, useEffect } from 'react';
import Buzzer from './Buzzer';
import styles from './QuestionCard.module.css';

export default function QuestionCard({ question, answered, socketRef }) {
    const [message, setMessage] = useState('');
    const [answering, setAnswering] = useState(false);

    useEffect(() => {
        socketRef.current.on("message", (message) => {
            setMessage(message);
        });
    })

    const handleBuzzerClick = () => {

    }

    return (
        <div className={styles['question-card']}>
            <div className={styles['question']}>
                {question.toUpperCase()}
            </div>
            <div className={styles['message']}>
                {message}
            </div>
            <Buzzer handleBuzzerClick={handleBuzzerClick} />
        </div>
    )
}