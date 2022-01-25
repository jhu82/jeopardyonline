import React from 'react';
import styles from './QuestionCard.module.css';

export default function QuestionCard({ question, message, answer, buzzer }) {

    return (
        <div className={styles['question-card']}>
            <div className={styles['question']}>
                {question.question.toUpperCase()}
            </div>
            <div className={styles['message']}>
                {message}
            </div>
            {buzzer}
            <div className={styles['answer-form']}>
                {answer}
            </div>
        </div>
    )
}