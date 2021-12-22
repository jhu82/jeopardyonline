import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import Cell from './Cell';
import styles from './Dashboard.module.css';

export default function Dashboard({ room, socketRef }) {

    const values = [200, 400, 600, 800, 1000];

    const categoryRow = room.questions.map(question => {
                            return <Cell key={question[0].category.id} value={question[0].category.title} />
                        })

    const questionColumns = room.questions.map(category => {
                            return <div className={styles['question-column']}> {
                                        category.map(question => {
                                            console.log(question);
                                            return <Cell key={question.id} value={question.value} question={question.question}/> 
                                        })
                                    }
                                    </div> 
                            })
    return (
        <div>
            <div className={styles['category-row']}>
                {categoryRow}
            </div>
            <div className={styles['questions']}>
                {questionColumns}
            </div>
        </div>
    )
}