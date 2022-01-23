import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import CategoryCell from './CategoryCell';
import QuestionCell from './QuestionCell';
import QuestionCard from './QuestionCard';
import styles from './GameBoard.module.css';
import User from './User';

export default function GamePage({ room, socketRef }) {
    
    const [selectedQuestion, setSelectedQuestion] = useState();

    const handleQuestionClick = (question) => {
        console.log(room);
        socketRef.current.emit("question_selected", room.roomID, question.id);
        console.log(question.id);
    }

    const categoryRow = room.questions.map(question => {
                            const title = question[0].category.title.toUpperCase();
                            return <CategoryCell 
                                         key={question[0].category.id} 
                                         value={title}
                                    />
                        })

    const userRow = room.players.map(player => {
                        return <User 
                                     key={player.id}
                                     player={player}
                                     isHost={player.id === room.hostID}
                                />
                        })
    

    const questionColumns = room.questions.map(category => {   
                                return <div className={styles['question-column']}>
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
        <>
            {selectedQuestion ? <QuestionCard 
                                    question={selectedQuestion}
                                /> :
                                <GameBoard
                                    categories={categoryRow}
                                    questions={questionColumns}
                                    users={userRow}
                                />
            }
        </>
    )
}