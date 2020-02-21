import React from 'react';
import { Link } from 'react-router-dom';

export default function PageTitle({name, user_name}) {
    const userLink = `/${user_name}`

    return(
        <div className='EventTitle'>
            <h3 className='EventName'>{name}</h3>
            <h4 className='EventCreator'>
                By: 
            </h4>
            <Link to={userLink}>
            {` ${user_name}`}
            </Link>
        </div>
    )
}