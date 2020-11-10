import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const GET_TODOS = gql`
{
    todos {
        task,
        id,
        status
    }
}
`;

const deleteTodo = gql`
  mutation deleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;


export default function TaskList() {
  const [deleteTask] = useMutation(deleteTodo);

  const handleDelete = (id) => {
    console.log(JSON.stringify(id))
    deleteTask({
      variables: {
        id: id,
      },
      refetchQueries: [{ query: GET_TODOS }],
    });
  };

  const { loading, error, data } = useQuery(GET_TODOS);

if(loading){
  return<>Loading...</>
}


  return (
    <List className="List">
      {data.todos.map(todo => {
        console.log(todo)
        return (

          <ListItem  role={undefined} dense button  className="List">
            <ListItemIcon key={(todo.id)}>
              <Checkbox
                edge="start"
                tabIndex={-1}
                disableRipple
                
              />
            </ListItemIcon>
            <ListItemText id={todo.task} primary={todo.task} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="comments" className="Delete">
                <DeleteIcon color="pink" onClick={() => handleDelete(todo.id)} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )})}
    </List>
  )
}