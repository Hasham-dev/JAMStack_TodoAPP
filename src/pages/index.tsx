import React, { useEffect, useState } from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import "./style.css";
import Navbar from "../components/NavBar";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TaskList from "../components/TaskList";
import Container from '@material-ui/core/Container';

// This query is executed at run time by Apollo.
const GET_TODOS = gql`
{
    todos {
        task,
        id,
        status
    }
}
`;
const ADD_TODO = gql`
    mutation addTodo($task: String!){
        addTodo(task: $task){
            task
        }
    }
`

export default function Home() {
    let inputText;

    const [addTodo] = useMutation(ADD_TODO);


    const addTask = () => {
        addTodo({
            variables: {
                task: inputText.value
            },
            refetchQueries: [{ query: GET_TODOS }]
        })
        inputText.value = "";
    }
    const handleDelete = (id) => {
        console.log(JSON.stringify(id));
        deleteTask({
            variables: {
                id: id,
            },
            refetchQueries: [{ query: GET_TODOS }],
        });
    };

    const { loading, error, data } = useQuery(GET_TODOS);

    if (loading)
        return <h2>Loading..</h2>

    if (error) {
        console.log(error)
        return <h2>Error</h2>
    }

    return (<div>

            <Navbar />
        <Container maxWidth="sm" className="container">

            <label>
                <h1> Add Todo </h1>
                <input type="text" ref={node => {
                    inputText = node;
                }} />
            </label><br/>
            <Button variant="contained" style={{color:"white"}} className="Add-Btn" onClick={addTask}>Add Todo</Button>

            <br /> <br />

            <h3> TODO LIST</h3>

            
                {/* <tbody>
                    {data.todos.map(todo => {
                        console.log(todo)
                        return <tr key={todo.id}>
                        <td> {todo.id} </td>
                        <td> {todo.task} </td>
                            <td> {todo.status.toString()} </td>
                            <td onClick={() => handleDelete(todo.id)}>Delete</td>
                            </tr>
                    })} */}
                    <TaskList />
                {/* </tbody> */}

        </Container>
    </div>
    );

}
