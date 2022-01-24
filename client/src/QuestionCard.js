import React, { useState, useEffect } from 'react';
import Buzzer from './Buzzer';
import styles from './QuestionCard.module.css';

export default function QuestionCard({ question, message, buzzer }) {

    return (
        <div className={styles['question-card']}>
            <div className={styles['question']}>
                {question.question.toUpperCase()}
            </div>
            <div className={styles['message']}>
                {message}
            </div>
            {buzzer}
        </div>
    )
}