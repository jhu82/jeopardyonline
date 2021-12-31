import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import LandingPage from './LandingPage';
import WaitingPage from './WaitingPage';
import DashBoard from './Dashboard';

export default function Session() {
    
    const [room, setRoom] = useState();
	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000");
            socketRef.current.on("connect_error", (error) => {
                console.log(error);
            })
            socketRef.current.on("joined", (room) => {
                setRoom(room);
            })
            socketRef.current.on("questions", (room) => {
                setRoom(room);
            })
            socketRef.current.on("error", (error) => {
                alert(error);
            })
			return () => socketRef.current.disconnect()
		},
		[]
	)

    return(
        <>
            { room ? room.questions.length !== 0 ? 
                                        <DashBoard   room={room} socketRef={socketRef} /> :
                                        <WaitingPage room={room} socketRef={socketRef} /> :
                                        <LandingPage socketRef={socketRef} /> 
            }
        </>
    )
}