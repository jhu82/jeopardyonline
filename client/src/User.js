import React from 'react';
import styles from './User.module.css';

export default function User({player, isHost}) {

    const playerType = isHost ? 'host' : 'guest';

    const formatMoney = (money) => {
        let moneyString = money >= 0 ? '$' : '-$';
        if (money < 0) money = 0 - money;
        moneyString = moneyString + money.toLocaleString();        
        return moneyString;
    }

    return(
        <div className={styles['user']}>
            <h4 className={styles[playerType]}>
                {player.name}
            </h4>
            <p1>
                {formatMoney(player.money)}
            </p1>
        </div>
    )
}