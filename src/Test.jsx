import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const Test = () => {
    const date=new Date()
    console.log(date);
    console.log(date.getDate());
    console.log(date.getMonth());
    console.log(date.getFullYear());
    const tarik=`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

    console.log(tarik);
    const n = date.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    console.log(`${tarik}, ${n}`);

    return (
        <div>
            <FontAwesomeIcon icon={faUser} />
        </div>
    )
}

export default Test
