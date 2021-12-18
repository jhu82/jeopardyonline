import React, { useState } from 'react';
import NameForm from './NameForm';
import RoomForm from './RoomForm';

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

    return(
        <div>
            { isName ?  <RoomForm 
                            value={roomID}
                            onChange={setRoomID}
                            onSubmit={handleJoinRoom}
                            onClick={handleCreateRoom}
                        /> :  
                        <NameForm
                            value={name}
                            onChange={setName}
                            onSubmit={handleSubmitName}
                        />
            }
        </div>
    )
}