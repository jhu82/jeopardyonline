import React from 'react';
import styles from './Page.module.css';

export default function Page(props) {
    return(
        <div className={styles['page']}>
            <div className={styles['logo']}>
                <img src="jeopardy.png" alt="" />
            </div>
            {props.children}
        </div>
    )
}