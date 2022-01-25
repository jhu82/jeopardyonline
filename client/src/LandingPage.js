import React, { useState } from 'react';
import Page from './Page';

export default function LandingPage({ socketRef }) {

    const [roomID, setRoomID] = useState("");
    const [name, setName] = useState("");
    const [isName, setIsName] = useState(false);

    const handleCreateRoom = async () => {
        await socketRef.current.emit("create_room", name);
    }

    const handleJoinRoom = async (event) => {
        event.preventDefault();
        await socketRef.current.emit("join_room", roomID, name);
    }

    const handleSubmitName = (event) => {
        event.preventDefault();
        setIsName(true);
    }

    const roomForm = () => {
        return <div>
                    <button onClick={handleCreateRoom}>Create New Room</button>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            name="roomID" 
                            placeholder="Enter Room ID" 
                            value={roomID} 
                            autoComplete="off"
                            onChange={e => {setRoomID(e.target.value)}} 
                        />
                    </form>
                </div>
    }

    const nameForm = () => {
        return  <div>
                    <form onSubmit={handleSubmitName}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Nickname"
                            value={name}
                            autoComplete="off"
                            onChange={e => {setName(e.target.value)}}
                        />
                    </form>
                </div>
    }
    return(
        <Page>
            { isName ?  roomForm() : nameForm() }
        </Page>
    )
}