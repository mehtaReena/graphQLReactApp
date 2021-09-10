import React, { useEffect, useRef, useState } from 'react';
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
  let inputRef = useRef();
   const { data, loading, error } = useQuery(READ_TODOS);
   const [createTodo] = useMutation(CREATE_TODO );
   const [deleteTodo] = useMutation(REMOVE_TODO );
  const [updateTodo] = useMutation(UPDATE_TODO);
    let[message , setMessage]=useState("")

  const [deleting , setDeleting] = useState(false)

  let [todos, setTodos] = useState([])
    // console.log(loading , todos  , data)

    useEffect(()=>{
            if(!loading){
        // eslint-disable-next-line
        setTodos(data.todos)

      }

// eslint-disable-next-line
    },[loading])




  if (loading) return <p>loading...</p>;
   if (error) return <p>ERROR</p>;
   if (!data) return <p>Not found</p>;
  //

const remove = async(id)=>{
  setDeleting(true)
     const res=await  deleteTodo({ variables: { id: id} });
      setDeleting(false)
   const newList = todos.filter((item)=>item.id!==id)
   console.log(res,data.removeTodo)
   setTodos(newList)


}
 const edit= async(id)=>{
  setDeleting(true)
  const res=await  updateTodo({ variables: { id: id} });
setDeleting(false)
const newList = todos.map((item) => {
  if (item.id === id) {
    const updatedItem = {
      ...item,
      completed: !item.completed,
    };
    return updatedItem;
  }
  return item;
});
console.log(res,data.updateTodo)
setTodos(newList)


 }




  return (
    <div className="app">
      <h3 style={{textAlign:"center"}}>Create New Todo</h3>
      <form onSubmit={ async(e) => {
        e.preventDefault();
        let task="";
        if(inputRef.current.value){
          task=inputRef.current.value
         const result= await createTodo({ variables: { text:task  } });
         inputRef.current.value = '';
         setTodos([...todos,result.data.createTodo])
          // console.log(" Result createTodo : "  ,result ,data.todos.length);
          // const response= await result;


        //  console.log(" Result after await  createTodo : "  , response);
               // window.location.reload();
    }
    else{
      setMessage("Please  enter some task!")
    } }

    }>   <div>
        <input className="form-control" type="text" placeholder="Enter todo" ref={inputRef}></input>
        <span style={{color:"red", fontSize:".9rem"}}>{message}</span>
        </div>
        <div>
        <button className="btn btn-primary px-5 my-2" type="submit">Submit</button></div>
      </form>
      <ul>

       {  deleting ?  <h6 style={{textAlign : 'center', color:'#17A2B8'}}> Procesing... </h6>:

       todos.map((todo) =>
          <li key={todo.id} style={{ width:"400px" ,padding:"5px"}}>
            <span className={todo.completed ? "done" : "pending"}>{todo.text}</span>
            <button className=" ml-3 btn btn-s btn-outline-danger float-right" onClick={(e)=>{  e.preventDefault(); remove(todo.id)}}
             >❌</button>
            <button className={`btn btn-s float-right ${todo.completed ? "btn-success" : "btn-info"}`} onClick={(e)=> { e.preventDefault(); edit(todo.id) }}>
              {todo.completed ? <span>Completed</span> : <span>Not completed</span>}</button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default App;