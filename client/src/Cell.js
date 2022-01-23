import React from 'react';

export default function Cell(props) {
    return (
        <div className={props.className} onClick={props.onClick}>
            {props.children}
        </div>
    )
}