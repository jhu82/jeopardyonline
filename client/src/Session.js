import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';

export default function Session() {
    const [messages, setMessage] = useState([]);
	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000");
            socketRef.current.on("connect_error", (error) => {
                console.log(error);
            })
            socketRef.current.on("message", (message) => {
                console.log(message);
                setMessage(messages => [...messages, message]);
            })
			return () => socketRef.current.disconnect()
		},
		[]
	)
    const displayMessage = () => {
        return messages.map(message => {
            return <div>{message}</div>
        })
    }
    const pressBuzzer = () => {
        socketRef.current.emit("buzzer", messages[0]);
    }
    return(
        <div>
            {displayMessage()}
            <button onClick={pressBuzzer}>Click Me</button>
        </div>
    )
}