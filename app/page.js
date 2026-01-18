"use client"

import { useState, useEffect, useRef } from "react";



const TodoListCard = (props) => {
  return (
    <>
      <br />
      <input checked={props.isCompleted} onChange={() => props.completedTodo(props.id)} type="checkbox" name="isCompleted" id={props.id} />
      <label style={{ textDecoration: props.isCompleted ? "line-through" : "none" }} htmlFor={props.id} className="mt-5">{props.todo}</label>
      <button onClick={() => props.deleteTodo(props.id)} className="rounded-full bg-red-500 px-2 py-1 text-white hover:bg-red-600 text-xs">delete</button>
      <button onClick={() => props.editTodo(props.id)} className="rounded-full bg-green-500 px-2 py-1 text-white hover:bg-green-600 text-xs">edit</button>
    </>
  )
}

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const inputRef = useRef(null);


  const [notEnterTodo, setNotEnterTodo] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("my-todo-list", JSON.stringify(todos));
    }
  }, [todos, isLoaded])

  useEffect(() => {
    const storedItems = localStorage.getItem("my-todo-list");
    if (storedItems) {
      setTodos(JSON.parse(storedItems));
    }
    setIsLoaded(true);
  }, [])

  const handleAddTodo = async () => {
    const newTodo = inputRef.current.value.trim();
    if (newTodo !== "") {
      setTodos([...todos, { todo: newTodo, isCompleted: false, id: Date.now() }]);
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    else {
      setNotEnterTodo(true);
    }
  }

  const deleteTodo = (id) => {
    const newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
  }

  const editTodo = (id) => {
    const currentTodo = todos.find(item => item.id === id).todo;
    const newTodo = prompt("Enter your todo", currentTodo);
    if (newTodo !== null && newTodo.trim() !== "") {
      const newTodos = todos.map(items => items.id === id ? { ...items, todo: newTodo } : items);
      setTodos(newTodos);
    }
  }

  const completedTodo = (id) => {
    const newTodos = todos.map(items => items.id === id ? { ...items, isCompleted: !items.isCompleted } : items);
    setTodos(newTodos);
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Todo List</h1>
      <input className="px-3" onChange={() => setNotEnterTodo(false)} ref={inputRef} type="text" placeholder="Enter your todo" />
      <button onClick={handleAddTodo}>Add Todo</button>
      {notEnterTodo && <p className="text-red fixed">Please enter a todo</p>}
      <ul>
        {todos.map((items, index) => (
          <TodoListCard key={index} completedTodo={() => completedTodo(items.id)} isCompleted={items.isCompleted} todo={items.todo} id={items.id} editTodo={() => editTodo(items.id)} deleteTodo={() => deleteTodo(items.id)} />
        ))}
      </ul>

    </>
  );
}
