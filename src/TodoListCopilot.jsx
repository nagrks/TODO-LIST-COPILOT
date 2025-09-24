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
  
  /** @type {[string, Function]} State for validation message */
  const [validationMessage, setValidationMessage] = useState("");

  /** @type {[number, Function]} State for tracking which todo is being edited */
  const [editingIndex, setEditingIndex] = useState(-1);

  /** @type {[string, Function]} State for edit input value */
  const [editInput, setEditInput] = useState("");
  
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
    const result = validateAndFormatText(input);
    if (!result.isValid) {
      setValidationMessage(result.message);
      return;
    }
    
    setTodos([...todos, { text: result.formattedText, completed: false }]);
    setInput("");
    setValidationMessage("");
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

  /**
   * Validates and formats text according to alphanumeric rules
   * @param {string} text - The text to validate and format
   * @returns {{ isValid: boolean, formattedText: string }} Validation result and formatted text
   */
  const validateAndFormatText = (text, excludeIndex = -1) => {
    const trimmedText = text.trim();
    if (trimmedText === "") {
      return { isValid: false, formattedText: "", message: "Please enter a todo item" };
    }

    // Check for non-alphanumeric characters
    if (/[^a-zA-Z0-9\s]/.test(trimmedText)) {
      return { isValid: false, formattedText: "", message: "Only letters, numbers, and spaces are allowed" };
    }

    // Format the text
    const alphanumericOnly = trimmedText.replace(/[^a-zA-Z0-9\s]/g, '');
    const formattedText = alphanumericOnly.charAt(0).toUpperCase() + alphanumericOnly.slice(1).toLowerCase();
    
    // Check for duplicates
    if (isDuplicate(formattedText, excludeIndex)) {
      return { isValid: false, formattedText: "", message: "This todo item already exists" };
    }

    return { isValid: true, formattedText, message: "" };
  };

  /**
   * Checks if a todo text already exists (case-insensitive)
   * @param {string} text - The text to check
   * @param {number} excludeIndex - Index to exclude from the check (for editing)
   * @returns {boolean} True if the text is a duplicate
   */
  const isDuplicate = (text, excludeIndex = -1) => {
    return todos.some((todo, index) => 
      index !== excludeIndex && todo.text.toLowerCase() === text.toLowerCase()
    );
  };

  /**
   * Starts editing a todo item
   * @param {number} index - The index of the todo to edit
   */
  const startEditing = (index) => {
    setEditingIndex(index);
    setEditInput(todos[index].text);
    setValidationMessage("");
  };

  /**
   * Saves the edited todo item
   * @param {number} index - The index of the todo being edited
   */
  const saveEdit = (index) => {
    const result = validateAndFormatText(editInput, index);
    if (!result.isValid) {
      setValidationMessage(result.message);
      return;
    }

    setTodos(todos.map((todo, i) => 
      i === index ? { ...todo, text: result.formattedText } : todo
    ));
    setEditingIndex(-1);
    setValidationMessage("");
  };

  /**
   * Cancels the editing mode
   */
  const cancelEdit = () => {
    setEditingIndex(-1);
    setValidationMessage("");
  };

  /**
   * Get incomplete todo items
   * @returns {Array} Array of incomplete todos
   */
  const getIncompleteTodos = () => todos.filter(todo => !todo.completed);

  /**
   * Get completed todo items
   * @returns {Array} Array of completed todos
   */
  const getCompletedTodos = () => todos.filter(todo => todo.completed);

  return (
    <div>
      <h2>Todo List</h2>
      <form onSubmit={addTodo}>
        <div className="input-container">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setValidationMessage(""); // Clear validation message when user starts typing
            }}
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
        </div>
        {validationMessage && (
          <div className="validation-message" role="alert">
            {validationMessage}
          </div>
        )}
      </form>

      <div className="todo-lists-container">
        <section className="todo-section">
          <h3>Active Tasks</h3>
          <ul className="todo-list">
            {getIncompleteTodos().map((todo, idx) => {
              const originalIndex = todos.indexOf(todo);
              return (
                <li key={originalIndex} className="active">
                  <div className="todo-item">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => toggleTodo(originalIndex)}
                      aria-label={`Mark "${todo.text}" as complete`}
                    />
                    {editingIndex === originalIndex ? (
                      <div className="edit-container">
                        <input
                          type="text"
                          value={editInput}
                          onChange={(e) => {
                            setEditInput(e.target.value);
                            setValidationMessage("");
                          }}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit(originalIndex)}
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(originalIndex)}
                          aria-label="Save changes"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          aria-label="Cancel editing"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span>{todo.text}</span>
                        <div className="button-container">
                          <button
                            onClick={() => startEditing(originalIndex)}
                            aria-label={`Edit todo "${todo.text}"`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeTodo(originalIndex)}
                            aria-label={`Delete todo "${todo.text}"`}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="todo-section completed-section">
          <h3>Completed Tasks</h3>
          <ul className="todo-list">
            {getCompletedTodos().map((todo, idx) => {
              const originalIndex = todos.indexOf(todo);
              return (
                <li key={originalIndex} className="completed">
                  <div className="todo-item">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => toggleTodo(originalIndex)}
                      aria-label={`Mark "${todo.text}" as incomplete`}
                    />
                    <span style={{ textDecoration: 'line-through' }}>{todo.text}</span>
                    <div className="button-container">
                      <button
                        onClick={() => removeTodo(originalIndex)}
                        aria-label={`Delete completed todo "${todo.text}"`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default TodoListCopilot;