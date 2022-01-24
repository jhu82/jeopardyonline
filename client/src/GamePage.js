import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import CategoryCell from './CategoryCell';
import QuestionCell from './QuestionCell';
import QuestionCard from './QuestionCard';
import Buzzer from './Buzzer';
import styles from './GameBoard.module.css';
import User from './User';

export default function GamePage({ room, socketRef }) {
    
    const [selectedQuestion, setSelectedQuestion] = useState();
    const [gameState, setGameState] = useState("");
    const [message, setMessage] = useState("");
    const [haveAnswered, setHaveAnswered] = useState(false);
    const [answer, setAnswer] = useState("");

    useEffect(
        () => {
            socketRef.current.on("question_sent", (question) => {
                setSelectedQuestion(question);
            })
            socketRef.current.on("question_ending", (message) => {
                setMessage(message);
            })
            socketRef.current.on("question_end", () => {
                setSelectedQuestion();
                setMessage(message);
                setHaveAnswered(false);
            })
            socketRef.current.on("buzzer_pressed", (message) => {
                setMessage(message);
            })
        }, 
        []
    )

    const handleQuestionClick = (question) => {
        socketRef.current.emit("question_selected", room.roomID, question.id);
    }

    const handleAnswerInput = (event) => {
        event.preventDefault();
        socketRef.current.emit("question_answered", socketRef.current.id, selectedQuestion.id, answer);
    }

    const handleBuzzerClick = () => {
        socketRef.current.emit("buzzer_pressed", room.roomID, socketRef.current.id, selectedQuestion.id);
        setHaveAnswered(true);
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
    
    const answerForm = () => {
        return  <div>
                    <form onSubmit={handleAnswerInput}>
                        <input
                            type="text"
                            name="answer"
                            placeholder="What is ______ ?"
                            value={answer}
                            autoComplete="off"
                            onChange={e => {setAnswer(e.target.value)}}
                        />
                    </form>
                </div>
    }

    return (
        <>
            {selectedQuestion ? <QuestionCard 
                                    question={selectedQuestion}
                                    message={message}
                                    gameState={gameState}
                                    answer={answerForm()}
                                    buzzer={
                                        <Buzzer 
                                            handleClick={() => handleBuzzerClick()}
                                            haveAnswered={haveAnswered}
                                        />
                                    }
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