import React, { Fragment, useState, useEffect } from 'react'
import gql from 'graphql-tag'

import InfiniteScroll from "react-infinite-scroll-component";

export default function TodoList(props) {

    //Setting the states from the component.
    const [isSearch, setIsSearch] = useState(false)

    const [values, setValues] = useState({
        loadedAllEvents: false,
        showNew: false,
        todoLength: 0,
        todos: [],
    });

    // Fetch Todo info.
    const getTodos = () => {
        props.client.query({
            query: gql`
                query fetchTodos ($todoLimit: Int, $todoOffset: Int) {
                    Todo (limit: $todoLimit, offset: $todoOffset) {
                        id
                        title
                        text
                      }
                }
            `,
            variables: {
                todoLimit: 10,
                todoOffset: 0
            }
        }).then(data => {
            // .then() is called right after the query is finished.
            // Set the state to returned array of todo's.
            setValues({
                ...values,
                todos: data.data.Todo
            });
        });
    }

    const loadMoreTodos = () => {
        console.log("load more")
    }

    useEffect(() => {
        // Fetch Todos on first render of page
        getTodos();
    }, [])

    return (
        <div>
            <h1>Things To Do:</h1>
            <InfiniteScroll
                dataLength={values.todoLength}
                next={loadMoreTodos}
                hasMore={!values.loadedAllEvents}
                loader={<div>Loading...</div>}
            >
                <ol>
                    {
                        values.todos.map((todo) => {
                            return(
                                <Fragment key={todo.id}>
                                    <li>
                                        <h4>{todo.title}</h4>
                                        <h5>{todo.text}</h5>
                                    </li>
                                </Fragment>
                            )
                        })
                    }
                </ol>
            </InfiniteScroll>
        </div>
    )
}