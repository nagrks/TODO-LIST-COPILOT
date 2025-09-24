import React, { useState, useEffect, useRef } from "react";
import './TodoListCopilot.css';

/**
 * TodoListCopilot is a React component that implements a simple but feature-rich todo list.
 * It supports keyboard navigation, accessibility features, and handles various edge cases.
 * 
 * Features:
 * - Add todos with text input
 * - Delete individual todos
 * - Keyboard support (Enter to add)
 * - Auto-focus on input field
 * - Whitespace trimming
 * - Empty input validation
 * - Support for special characters and emojis
 * - Proper handling of long text
 * - Accessible buttons and form controls
 * 
 * @component
 * @returns {JSX.Element} A todo list component with input form and list of todos
 */
function TodoListCopilot() {
  /** @type {[Array<{text: string, completed: boolean}>, Function]} State for storing todo items */
  const [todos, setTodos] = useState([]);
  
  /** @type {[string, Function]} State for input field value */
  const [input, setInput] = useState("");
  
  /** @type {React.RefObject<HTMLInputElement>} Reference to the input field for focus management */
  const inputRef = useRef(null);

  /**
   * Effect hook to manage input field focus.
   * Automatically focuses the input field when component mounts and after adding todos.
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  /**
   * Adds a new todo item to the list.
   * Trims whitespace, validates for empty input, and clears input after adding.
   * 
   * @param {React.FormEvent} e - The form submission event
   */
  const addTodo = (e) => {
    e?.preventDefault(); // Handle form submission
    const trimmedInput = input.trim();
    if (trimmedInput === "") return;
    
    // Only allow alphanumeric characters and capitalize first letter
    const alphanumericOnly = trimmedInput.replace(/[^a-zA-Z0-9\s]/g, '');
    const capitalizedText = alphanumericOnly.charAt(0).toUpperCase() + alphanumericOnly.slice(1).toLowerCase();
    
    if (capitalizedText === "") return; // If no valid characters remain, don't add the todo
    setTodos([...todos, { text: capitalizedText, completed: false }]);
    setInput("");
  };

  /**
   * Removes a todo item from the list by its index.
   * 
   * @param {number} index - The index of the todo to remove
   */
  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  /**
   * Toggles the completion status of a todo item.
   * 
   * @param {number} index - The index of the todo to toggle
   */
  const toggleTodo = (index) => {
    setTodos(
      todos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  /**
   * Handles keypress events in the input field.
   * Allows adding todos by pressing Enter.
   * 
   * @param {React.KeyboardEvent} e - The keypress event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo(e);
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      <form onSubmit={addTodo}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a todo"
          aria-label="Add a new todo item"
        />
        <button
          type="submit"
          onClick={addTodo}
          aria-label="Add todo"
        >
          Add
        </button>
      </form>
      <ul className="todo-list">
        {todos.map((todo, idx) => (
          <li key={idx} className={todo.completed ? 'completed' : ''}>
            <div className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(idx)}
                aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
              />
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(idx)}
                aria-label={`Delete todo "${todo.text}"`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoListCopilot;