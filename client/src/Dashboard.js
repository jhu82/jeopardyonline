import React from 'react';
import Cell from './Cell';
import User from './User';
import styles from './Dashboard.module.css';

export default function Dashboard({ room, socketRef }) {

    const firstValues  = [200, 400, 600, 800, 1000];

    const categoryRow = room.questions.map(question => {
                            const title = question[0].category.title.toUpperCase();
                            return <Cell key={question[0].category.id} 
                                         type='category' 
                                         value={title} 
                                    />
                        })

    const userRow = room.players.map(player => {
                        return <User key={player.id}
                                     player={player}
                                     isHost={player.id === room.hostID}
                                />
                        })

    const questionColumns = room.questions.map(category => {
                            let index = 0;
                            return <div className={styles['question-column']}>
                                        {category.map(question => {
                                            return <Cell key={question.id} 
                                                         type='question'
                                                         value={`$${firstValues[index++]}`} 
                                                         question={question.question}
                                                    /> 
                                            })
                                        }
                                    </div> 
                            })
    return (
        <div className={styles['dashboard']}>
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