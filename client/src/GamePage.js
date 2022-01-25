import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import QuestionCard from './QuestionCard';
import Buzzer from './Buzzer';

export default function GamePage({ room, socketRef }) {
    
    const [selectedQuestion, setSelectedQuestion] = useState();
    const [message, setMessage] = useState("");
    const [playerAnswering, setPlayerAnswering] = useState({isPlayerAnswering: false, playerID: ""});
    const [haveAnswered, setHaveAnswered] = useState(false);
    const [answer, setAnswer] = useState("");

    const resetState = () => {
        setSelectedQuestion();
        setMessage("");
        setPlayerAnswering({isPlayerAnswering: false, playerID: ""});
        setHaveAnswered(false);
        setAnswer("");
    }

    useEffect(
        () => {
            socketRef.current.on("question_sent", (question) => {
                setMessage("");
                setSelectedQuestion(question);
            })
            socketRef.current.on("message", (message, state) => {
                if (state === "disable_input") {
                    setPlayerAnswering({isPlayerAnswering: true, playerID: ""});
                } else if (state === "disable_buzzer") {
                    setHaveAnswered(true);
                }
                setMessage(message);
            })
            socketRef.current.on("question_end", () => {
                resetState();
            })
            socketRef.current.on("buzzer_pressed", (playerID) => {
                setPlayerAnswering({isPlayerAnswering: true, playerID: playerID});
            })
            socketRef.current.on("incorrect_answer", () => {
                setPlayerAnswering({isPlayerAnswering: false, playerID: ""});
                socketRef.current.emit("question_selected", selectedQuestion.id);
            })
            return () => {
                socketRef.current.off("incorrect_answer");
            }
        }, 
        [selectedQuestion]
    )

    const handleQuestionClick = (question) => {
        if (question.answered || room.hostID !== socketRef.current.id) return;
        socketRef.current.emit("question_selected", question.id);
    }

    const handleAnswerInput = (event) => {
        event.preventDefault();
        socketRef.current.emit("player_answered", selectedQuestion.id, answer);
    }

    const handleBuzzerClick = () => {
        socketRef.current.emit("buzzer_pressed", selectedQuestion.id);
        setHaveAnswered(true);
    }
    
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
                                    answer={(playerAnswering.playerID === socketRef.current.id) && answerForm}
                                    buzzer={
                                        <Buzzer 
                                            handleClick={() => handleBuzzerClick()}
                                            enabled={!playerAnswering.isPlayerAnswering && !haveAnswered}
                                        />
                                    }
                                /> :
                                <GameBoard
                                    questions={room.questions}
                                    players={room.players}
                                    hostID={room.hostID}
                                    handleQuestionClick={handleQuestionClick}
                                />
            }
        </>
    )
}