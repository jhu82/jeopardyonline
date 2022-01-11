import React from 'react';
import styles from './WaitingPage.module.css';

export default function WaitingPage({room, socketRef}) {

    const displayJoinedPlayers = () => {
        return room.players.map(player => {
            return <div key={player.id}>{player.name} has joined</div>
        })
    }

    const startGame = () => {
        socketRef.current.emit("initialize", room.roomID);
    }

    return(
        <div className={styles['waiting-page']}>
            <div>
                {room.roomID}
            </div>
            <div>
                {displayJoinedPlayers()}
            </div>
            <div>
                <button className="start-button" onClick={() => startGame()}>START GAME</button>
            </div>
        </div>
    )
}