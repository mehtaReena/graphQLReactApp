import React, { useEffect, useState } from 'react';
import './App.css';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";
// import {gql} from '@apollo/client'

const READ_TODOS = gql`
  query todos{
    todos {
      id
      text
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($text: String!) {
    createTodo(text: $text){
      id
      text
      completed

    }

  }

`;

const REMOVE_TODO = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id)
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!) {
    updateTodo(id: $id)
  }
`;

function App() {
  let input;

   const { data, loading, error } = useQuery(READ_TODOS);
   const [createTodo] = useMutation(CREATE_TODO );
   const [deleteTodo] = useMutation(REMOVE_TODO );
  const [updateTodo] = useMutation(UPDATE_TODO);

  let [todos, setTodos] = useState([])
    console.log(loading , todos  , data)

    useEffect(()=>{
            if(!loading){
        // eslint-disable-next-line
        setTodos(data.todos)

      }

// eslint-disable-next-line
    },[loading ,data.todos])




  if (loading) return <p>loading...</p>;
   if (error) return <p>ERROR</p>;
   if (!data) return <p>Not found</p>;
  //






  return (
    <div className="app">
      <h3 style={{textAlign:"center"}}>Create New Todo</h3>
      <form onSubmit={ async(e) => {
        e.preventDefault();
         const result= await createTodo({ variables: { text: input.value } });

         setTodos([...todos,result.data.createTodo])
          console.log(" Result createTodo : "  ,result ,data.todos.length);
          // const response= await result;


        //  console.log(" Result after await  createTodo : "  , response);
      //  input.value = '';

        // window.location.reload();
      }}>
        <input className="form-control" type="text" placeholder="Enter todo" ref={node => { input = node; }}></input>
        <button className="btn btn-primary px-5 my-2" type="submit">Submit</button>
      </form>
      <ul>
       {todos.map((todo) =>
          <li key={todo.id} style={{ width:"400px" ,padding:"5px"}}>
            <span className={todo.completed ? "done" : "pending"}>{todo.text}</span>
            <button className=" ml-3 btn btn-s btn-outline-danger float-right" onClick={() => {
               deleteTodo({ variables: { id: todo.id} });
              window.location.reload();
            }}>❌</button>
            <button className={`btn btn-s float-right ${todo.completed ? "btn-success" : "btn-info"}`} onClick={() => {
              updateTodo({ variables: { id: todo.id} });
              window.location.reload();
            }}>{todo.completed ? <span>Completed</span> : <span>Not completed</span>}</button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default App;