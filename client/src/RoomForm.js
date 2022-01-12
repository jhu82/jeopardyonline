import React from 'react';

export default function RoomForm({ value, onChange, onSubmit, onClick }) {
    return(
        <div>
            <button onClick={onClick}>Create New Room</button>
            <form onSubmit={onSubmit}>
                <input 
                    type="text"
                    name="roomID" 
                    placeholder="Enter Room ID" 
                    value={value} 
                    autocomplete="off"
                    onChange={e => {onChange(e.target.value)}} 
                />
            </form>
        </div>
    )
}