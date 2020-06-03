import React from 'react';
import { Link } from 'react-router-dom';

require('./InfoItems.css');

export default function PageTitle({name, user_name, location}) {
    const userLink = `/${user_name}`

    return(
        <div className='ItemTitle'>
            <h1 className='ItemName'>{name}</h1>

            <h4 className='ItemCreator'>
                {location}
            </h4>
            {/* <Link to={userLink}>
            {` ${user_name}`}
            </Link> */}
        </div>
    )
}