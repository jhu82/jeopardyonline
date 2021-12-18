import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import LandingPage from './LandingPage';
import WaitingPage from './WaitingPage';

export default function Session() {
    
    const [room, setRoom] = useState({});
	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000");
            socketRef.current.on("connect_error", (error) => {
                console.log(error);
            })
            socketRef.current.on("joined", (roomID, roomSize) => {
                setRoom({"roomID": roomID, "roomSize": roomSize });
                console.log(roomID);
            })
			return () => socketRef.current.disconnect()
		},
		[]
	)

    return(
        <div>
            <LandingPage socketRef={socketRef} />
        </div>
    )
}