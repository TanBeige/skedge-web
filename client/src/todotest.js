import React, { Fragment, useState, useEffect } from 'react'
import gql from 'graphql-tag'

import InfiniteScroll from "react-infinite-scroll-component";

export default function TodoList(props) {

    let _isMounted = true;

    //Setting the states from the component.
    const todoLimit = 10;

    const [values, setValues] = useState({
        loadedAllTodos: false,
        showNew: false,
        todos: [],
    });

    // Fetch Todo info.
    const getTodos = () => {
        props.client.query({
            query: gql`
                query fetchTodos ($todoLimit: Int, $todoOffset: Int) {
                    todo (limit: $todoLimit, offset: $todoOffset) {
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
                todos: data.data.todo,
                loadedAllTodos: data.data.todo < todoLimit ? true:false
            });
        });
    }

    const loadMoreTodos = () => {
        props.client.query({
            query: gql`
                query fetchTodos ($todoLimit: Int, $todoOffset: Int) {
                    todo (limit: $todoLimit, offset: $todoOffset) {
                        id
                        title
                        text
                    }
                }
            `,
            variables: {
                todoLimit: 10,
                todoOffset: values.todos.length
            }
        }).then(data => {
            if(_isMounted) {
                const mergedTodos = values.todos.concat(data.data.todo);

                // update state with new todos
                setValues({
                    ...values,
                    todos: mergedTodos,
                    loadedAllTodos: data.data.todo < todoLimit ? true:false
                });
            }
        }).catch(error => {
            console.log(error)
        });
    }

    useEffect(() => {
        _isMounted = true;
        // Fetch Todos on first render of page
        getTodos();

        return () => {
            _isMounted = false;
        }
    }, [])

    return (
        <div>
            <h1>Things To Do:</h1>
            <InfiniteScroll
                dataLength={values.todos.length}
                next={loadMoreTodos}
                hasMore={!values.loadedAllTodos}
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