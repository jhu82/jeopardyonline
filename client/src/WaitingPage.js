import React from 'react';
import styles from './WaitingPage.module.css';

export default function WaitingPage({room, socketRef}) {

    const displayJoinedPlayers = () => {
        return room.players.map(player => {
            return <p key={player.id}>{player.name} has joined</p>
        })
    }

    const startGame = () => {
        socketRef.current.emit("initialize", room.roomID);
    }

    return(
        <div className={styles['waiting-page']}>
            <div className={styles['logo']}>
                <img src="jeopardy.png" alt="" />
            </div>
            <div>
                <h1>{room.roomID}</h1>
                {displayJoinedPlayers()}
                <button className="start-button" onClick={() => startGame()}>START GAME</button>
            </div>
        </div>
    )
}