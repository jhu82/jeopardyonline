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
    const [message, setMessage] = useState("");
    const [playerAnswering, setPlayerAnswering] = useState("");
    const [haveAnswered, setHaveAnswered] = useState(false);
    const [answer, setAnswer] = useState("");

    const resetState = () => {
        setSelectedQuestion();
        setMessage("");
        setPlayerAnswering("");
        setHaveAnswered(false);
    }

    useEffect(
        () => {
            socketRef.current.on("question_sent", (question) => {
                setMessage("");
                setSelectedQuestion(question);
            })
            socketRef.current.on("message", (message, state) => {
                if (state === "disable_input") {
                    setPlayerAnswering("");
                    setAnswer("");
                } else if (state === "disable_buzzer") {
                    setHaveAnswered(true);
                }
                setMessage(message);
            })
            socketRef.current.on("question_end", () => {
                resetState();
            })
            socketRef.current.on("buzzer_pressed", (playerID) => {
                setPlayerAnswering(playerID);
            })
            socketRef.current.on("incorrect_answer", () => {
                socketRef.current.emit("question_selected", room.roomID, selectedQuestion.id);
            })
            return () => {
                socketRef.current.off("incorrect_answer");
            }
        }, 
        [selectedQuestion]
    )

    const handleQuestionClick = (question) => {
        if (question.answered) return;
        socketRef.current.emit("question_selected", room.roomID, question.id);
    }

    const handleAnswerInput = (event) => {
        event.preventDefault();
        socketRef.current.emit("player_answered", room.roomID, socketRef.current.id, selectedQuestion.id, answer);
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
    
    const answerForm = (
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
                        );

    return (
        <>
            {selectedQuestion ? <QuestionCard 
                                    question={selectedQuestion}
                                    message={message}
                                    answer={(playerAnswering === socketRef.current.id) && answerForm}
                                    buzzer={
                                        <Buzzer 
                                            handleClick={() => handleBuzzerClick()}
                                            enabled={!playerAnswering && !haveAnswered}
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