import React from 'react';
import Page from './Page';

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
        <Page>
            <div>
                <h1>{room.roomID}</h1>
                {displayJoinedPlayers()}
                <button className="start-button" onClick={() => startGame()}>START GAME</button>
            </div>
        </Page>
    )
}