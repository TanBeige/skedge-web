import React from 'react';
import { Link } from 'react-router-dom';

require('./InfoItems.css');

export default function PageTitle({name, user_name}) {
    const userLink = `/${user_name}`

    return(
        <div className='ItemTitle'>
            <h3 className='ItemName'>{name}</h3>
            {/* <h4 className='ItemCreator'>
                By: 
            </h4>
            <Link to={userLink}>
            {` ${user_name}`}
            </Link> */}
        </div>
    )
}