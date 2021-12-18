import React from 'react';

export default function RoomForm({ value, onChange, onSubmit, onClick }) {
    return(
        <div>
            <button onClick={onClick}>Create New Room</button>
            <form onSubmit={onSubmit}>
                <input 
                    name="roomID" 
                    placeholder="Room ID" 
                    value={value} 
                    onChange={e => {onChange(e.target.value)}} 
                />
                <input type="submit" />
            </form>
        </div>
    )
}