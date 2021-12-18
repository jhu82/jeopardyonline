import React from 'react';

export default function NameForm({ value, onChange, onSubmit }) {
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    name="name"
                    placeholder="Nickname"
                    value={value}
                    onChange={e => {onChange(e.target.value)}}
                />
                <input type="submit" />
            </form>
        </div>
    )
}