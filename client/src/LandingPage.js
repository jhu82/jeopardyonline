import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';

export default function LandingPage(props) {
    const [room, setRoom] = useState("");
    const [roomID, setRoomID] = useState("");
	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000");
            socketRef.current.on("connect_error", (error) => {
                console.log(error);
            })
			return () => socketRef.current.disconnect()
		},
		[]
	)

    const createRoom = async () => {
        await socketRef.current.emit("create_room");
        socketRef.current.on("joined", (roomID) => {
            setRoom(roomID);
        });
    }

    const joinRoom = async (event) => {
        event.preventDefault();
        await socketRef.current.emit("join_room", roomID);
        socketRef.current.on("joined", (roomID, roomSize) => {
            setRoom(roomID);
            console.log(roomSize);
        })
    }

    return(
        <div>
            <button onClick={createRoom}>Create New Room</button>
            <form onSubmit={joinRoom}>
                <input 
                    name="roomID" 
                    placeholder="Room ID" 
                    value={roomID} 
                    onChange={e => {setRoomID(e.target.value)}} 
                />
                <input type="submit" />
            </form>
        </div>
    )
}