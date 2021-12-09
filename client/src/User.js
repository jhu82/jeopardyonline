import React, {useState, useEffect, useRef} from 'react';
import  io from 'socket.io-client';

export default function Connection() {
    const [ categories, setCategories ] = useState([]);

	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000");
            socketRef.current.on("connect_error", (error) => {
                console.log(error);
            })
            socketRef.current.emit("initialize");
            socketRef.current.on("categories", (categories) => {
                setCategories(categories);
            })
			return () => socketRef.current.disconnect()
		},
		[]
	)

    const renderCategories = () => {
        return categories.map(category => 
            <div key={category.id}>{category.title}</div>
        )
    }

    return (
		<div>
            {renderCategories()}
        </div>
    );
}