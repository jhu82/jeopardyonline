import React from 'react';

export default function NameForm({ value, onChange, onSubmit }) {
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter Nickname"
                    value={value}
                    autocomplete="off"
                    onChange={e => {onChange(e.target.value)}}
                />
            </form>
        </div>
    )
}