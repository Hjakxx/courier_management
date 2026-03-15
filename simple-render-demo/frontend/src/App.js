import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/todos`)
      .then(res => res.json())
      .then(setTodos);
  }, []);

  return (
    <div className="App">
      <h1>🚀 Simple React + Node on Render</h1>
      <p>Backend API working! (No DB needed)</p>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            {todo.text}
          </li>
        ))}
      </ul>
      <div>Backend: {process.env.REACT_APP_API_URL || 'localhost:3001'}</div>
    </div>
  );
}

export default App;
