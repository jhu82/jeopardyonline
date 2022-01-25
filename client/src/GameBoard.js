import React from 'react';
import CategoryCell from './CategoryCell';
import QuestionCell from './QuestionCell';
import User from './User';
import styles from './GameBoard.module.css';

export default function GameBoard({ questions, players, hostID, handleQuestionClick }) {

    const categoryRow = questions.map(question => {
        const title = question[0].category.title.toUpperCase();
        return <CategoryCell 
                     key={question[0].category.id} 
                     value={title}
                />
    })

    const userRow = players.map(player => {
        return <User 
                    key={player.id}
                    player={player}
                    isHost={player.id === hostID}
                />
    })


    const questionColumns = questions.map(category => {   
        return <div key={category[0].category_id} className={styles['question-column']}>
                    {category.map(question => {
                        return <QuestionCell 
                                        key={question.id} 
                                        value={question.value}
                                        onClick={() => handleQuestionClick(question)}
                                        question={question}
                                /> 
                        })
                    }
                </div>
    })

    return (
        <div className={styles['game-board']}>
            <div className={styles['category-row']}>
                {categoryRow}
            </div>
            <div className={styles['questions']}>
                {questionColumns}
            </div>
            <div className={styles['user-row']}>
                {userRow}
            </div>
        </div>
    )
}