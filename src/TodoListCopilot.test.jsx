import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';import '@testing-library/jest-dom';
import TodoListCopilot from './TodoListCopilot';

describe('TodoListCopilot', () => {
  let input;
  let addButton;

  beforeEach(() => {
    render(<TodoListCopilot />);
    input = screen.getByPlaceholderText('Add a todo');
    addButton = screen.getByText('Add');
  });

  describe('Initial Rendering', () => {
    test('renders todo list with header and empty state', () => {
      expect(screen.getByText('Todo List')).toBeInTheDocument();
      expect(screen.queryAllByText('Delete').length).toBe(0);
      expect(input).toHaveValue('');
    });

    test('input should be focused by default for better UX', () => {
      expect(input).toHaveFocus();
    });
  });

  describe('Adding Todos', () => {
    test('should add todo with keyboard Enter key', () => {
      fireEvent.change(input, { target: { value: 'Submit with Enter' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
      
      expect(screen.getByText('Submit with Enter')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    test('should show validation message for special characters', () => {
      const todoWithSpecialChars = '!@#$ Special % Characters &*()';
      fireEvent.change(input, { target: { value: todoWithSpecialChars } });
      fireEvent.click(addButton);

      expect(screen.getByText('Only letters, numbers, and spaces are allowed')).toBeInTheDocument();
      expect(screen.queryByText('Special characters')).not.toBeInTheDocument();
    });

    test('should remove non-alphanumeric characters', () => {
      const todoWithEmojis = '📝 Write documentation 🎉';
      fireEvent.change(input, { target: { value: todoWithEmojis } });
      fireEvent.click(addButton);

      expect(screen.getByText('Write documentation')).toBeInTheDocument();
    });

    test('should trim whitespace from todos', () => {
      fireEvent.change(input, { target: { value: '   Trim this todo   ' } });
      fireEvent.click(addButton);

      expect(screen.getByText('Trim this todo')).toBeInTheDocument();
    });

    test('should handle long todo text gracefully', () => {
      const longTodo = 'This is a very long todo item that might need to be handled properly in terms of display and wrapping in the UI to ensure good user experience';
      fireEvent.change(input, { target: { value: longTodo } });
      fireEvent.click(addButton);

      const todoElement = screen.getByText(longTodo);
      expect(todoElement).toBeInTheDocument();
      expect(todoElement).toBeVisible();
    });
  });

  describe('Todo Management', () => {
    test('should maintain todo order when deleting items', () => {
      // Add three todos
      ['First Task', 'Second Task', 'Third Task'].forEach(todo => {
        fireEvent.change(input, { target: { value: todo } });
        fireEvent.click(addButton);
      });

      // Delete the second task
      const todoItems = screen.getAllByText(/Task/);
      const secondTaskDeleteBtn = within(todoItems[1].parentElement).getByText('Delete');
      fireEvent.click(secondTaskDeleteBtn);

      // Verify remaining todos are in correct order
      const remainingTodos = screen.getAllByText(/Task/);
      expect(remainingTodos[0]).toHaveTextContent('First Task');
      expect(remainingTodos[1]).toHaveTextContent('Third Task');
    });

    test('should handle rapid addition and deletion of todos', () => {
      // Rapidly add multiple todos
      const todos = ['Quick Task 1', 'Quick Task 2', 'Quick Task 3'];
      todos.forEach(todo => {
        fireEvent.change(input, { target: { value: todo } });
        fireEvent.click(addButton);
      });

      // Delete todos one by one from the start
      todos.forEach(() => {
        const firstDeleteButton = screen.getAllByText('Delete')[0];
        fireEvent.click(firstDeleteButton);
      });

      // Verify all todos are removed
      expect(screen.queryByText(/Quick Task/)).not.toBeInTheDocument();
    });

    test('should prevent XSS attempts in todo items', () => {
      const maliciousScript = '<script>alert("xss")</script>';
      fireEvent.change(input, { target: { value: maliciousScript } });
      fireEvent.click(addButton);

      const todoElement = screen.getByText(maliciousScript);
      expect(todoElement.innerHTML).not.toBe(maliciousScript);
    });

    test('should prevent duplicate todo items', () => {
      const todoText = 'Unique Todo';
      
      // Add first todo
      fireEvent.change(input, { target: { value: todoText } });
      fireEvent.click(addButton);

      // Try to add the same todo again
      fireEvent.change(input, { target: { value: todoText } });
      fireEvent.click(addButton);

      // Verify duplicate message and only one todo exists
      expect(screen.getByText('This todo item already exists')).toBeInTheDocument();
      expect(screen.getAllByText(todoText)).toHaveLength(1);

      // Try with different case
      fireEvent.change(input, { target: { value: todoText.toUpperCase() } });
      fireEvent.click(addButton);

      expect(screen.getByText('This todo item already exists')).toBeInTheDocument();
      expect(screen.getAllByText(todoText)).toHaveLength(1);
    });
  });

  describe('Accessibility', () => {
    test('should have accessible buttons with clear purposes', () => {
      fireEvent.change(input, { target: { value: 'Accessibility Test' } });
      fireEvent.click(addButton);

      expect(addButton).toHaveAttribute('aria-label', 'Add todo');
      const deleteButton = screen.getByText('Delete');
      expect(deleteButton).toHaveAttribute('aria-label', expect.stringContaining('Delete todo'));
    });

    test('should maintain focus after adding todo', () => {
      fireEvent.change(input, { target: { value: 'New Todo' } });
      fireEvent.click(addButton);
      
      expect(input).toHaveFocus();
    });
  });

  describe('Todo Completion', () => {
    test('should toggle todo completion status', () => {
      // Add a todo
      fireEvent.change(input, { target: { value: 'Test Todo' } });
      fireEvent.click(addButton);

      // Get the checkbox
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      // Toggle completion
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      // Verify text decoration
      const todoText = screen.getByText('Test Todo');
      expect(todoText).toHaveStyle({ textDecoration: 'line-through' });

      // Toggle back to incomplete
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
      expect(todoText).toHaveStyle({ textDecoration: 'none' });
    });

    test('should maintain completion status after adding new todos', () => {
      // Add and complete first todo
      fireEvent.change(input, { target: { value: 'First Todo' } });
      fireEvent.click(addButton);
      const firstCheckbox = screen.getByRole('checkbox');
      fireEvent.click(firstCheckbox);
      expect(firstCheckbox).toBeChecked();

      // Add second todo
      fireEvent.change(input, { target: { value: 'Second Todo' } });
      fireEvent.click(addButton);

      // Verify first todo remains completed
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });

    test('should have accessible checkbox labels', () => {
      fireEvent.change(input, { target: { value: 'Accessibility Todo' } });
      fireEvent.click(addButton);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', expect.stringContaining('Accessibility Todo'));
      expect(checkbox).toHaveAttribute('aria-label', expect.stringContaining('complete'));

      // After checking
      fireEvent.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-label', expect.stringContaining('incomplete'));
    });
  });

  describe('Todo Editing', () => {
    test('should enter edit mode when clicking edit button', () => {
      // Add a todo
      fireEvent.change(input, { target: { value: 'Test todo' } });
      fireEvent.click(addButton);

      // Click edit button
      const editButton = screen.getByLabelText('Edit todo "Test todo"');
      fireEvent.click(editButton);

      // Verify edit mode
      const editInput = screen.getByDisplayValue('Test todo');
      expect(editInput).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('should validate edited text', () => {
      // Add a todo
      fireEvent.change(input, { target: { value: 'Original todo' } });
      fireEvent.click(addButton);

      // Enter edit mode
      const editButton = screen.getByLabelText('Edit todo "Original todo"');
      fireEvent.click(editButton);

      // Try to save invalid input
      const editInput = screen.getByDisplayValue('Original todo');
      fireEvent.change(editInput, { target: { value: '!@#$' } });
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      // Verify validation message
      expect(screen.getByText('Only letters, numbers, and spaces are allowed')).toBeInTheDocument();
      expect(editInput).toBeInTheDocument(); // Still in edit mode
    });

    test('should save valid edits', () => {
      // Add a todo
      fireEvent.change(input, { target: { value: 'Original todo' } });
      fireEvent.click(addButton);

      // Enter edit mode
      const editButton = screen.getByLabelText('Edit todo "Original todo"');
      fireEvent.click(editButton);

      // Make valid edit
      const editInput = screen.getByDisplayValue('Original todo');
      fireEvent.change(editInput, { target: { value: 'Updated todo' } });
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      // Verify changes
      expect(screen.getByText('Updated todo')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Updated todo')).not.toBeInTheDocument(); // No longer in edit mode
    });

    test('should cancel edits', () => {
      // Add a todo
      fireEvent.change(input, { target: { value: 'Original todo' } });
      fireEvent.click(addButton);

      // Enter edit mode
      const editButton = screen.getByLabelText('Edit todo "Original todo"');
      fireEvent.click(editButton);

      // Make changes and cancel
      const editInput = screen.getByDisplayValue('Original todo');
      fireEvent.change(editInput, { target: { value: 'Changed todo' } });
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      // Verify original text remains
      expect(screen.getByText('Original todo')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Changed todo')).not.toBeInTheDocument();
    });

    test('should prevent duplicate edits', () => {
      // Add two todos
      fireEvent.change(input, { target: { value: 'First todo' } });
      fireEvent.click(addButton);
      fireEvent.change(input, { target: { value: 'Second todo' } });
      fireEvent.click(addButton);

      // Try to edit second todo to match first todo
      const editButton = screen.getByLabelText('Edit todo "Second todo"');
      fireEvent.click(editButton);

      const editInput = screen.getByDisplayValue('Second todo');
      fireEvent.change(editInput, { target: { value: 'First todo' } });
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      // Verify error message and no changes made
      expect(screen.getByText('This todo item already exists')).toBeInTheDocument();
      expect(screen.getByText('Second todo')).toBeInTheDocument();

      // Try with different case
      fireEvent.change(editInput, { target: { value: 'FIRST TODO' } });
      fireEvent.click(saveButton);

      expect(screen.getByText('This todo item already exists')).toBeInTheDocument();
      expect(screen.getByText('Second todo')).toBeInTheDocument();
    });
  });

  describe('Todo Sections', () => {
    test('should move completed todos to completed section', () => {
      // Add todos
      ['First Todo', 'Second Todo', 'Third Todo'].forEach(todo => {
        fireEvent.change(input, { target: { value: todo } });
        fireEvent.click(addButton);
      });

      // Complete the second todo
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);

      // Verify sections
      const activeTodos = screen.getByText('Active Tasks')
        .parentElement.querySelectorAll('li');
      const completedTodos = screen.getByText('Completed Tasks')
        .parentElement.querySelectorAll('li');

      expect(activeTodos).toHaveLength(2);
      expect(completedTodos).toHaveLength(1);
      
      // Verify content
      expect(within(activeTodos[0]).getByText('First Todo')).toBeInTheDocument();
      expect(within(activeTodos[1]).getByText('Third Todo')).toBeInTheDocument();
      expect(within(completedTodos[0]).getByText('Second Todo')).toBeInTheDocument();
    });

    test('should move todos between sections when toggling completion', () => {
      // Add and complete a todo
      fireEvent.change(input, { target: { value: 'Test Todo' } });
      fireEvent.click(addButton);
      
      const checkbox = screen.getByRole('checkbox');
      
      // Complete the todo
      fireEvent.click(checkbox);
      
      let activeTodos = screen.getByText('Active Tasks')
        .parentElement.querySelectorAll('li');
      let completedTodos = screen.getByText('Completed Tasks')
        .parentElement.querySelectorAll('li');
      
      expect(activeTodos).toHaveLength(0);
      expect(completedTodos).toHaveLength(1);
      
      // Uncomplete the todo
      fireEvent.click(screen.getByRole('checkbox'));
      
      activeTodos = screen.getByText('Active Tasks')
        .parentElement.querySelectorAll('li');
      completedTodos = screen.getByText('Completed Tasks')
        .parentElement.querySelectorAll('li');
      
      expect(activeTodos).toHaveLength(1);
      expect(completedTodos).toHaveLength(0);
    });

    test('should only show edit button for incomplete todos', () => {
      // Add a todo and complete it
      fireEvent.change(input, { target: { value: 'Test Todo' } });
      fireEvent.click(addButton);
      fireEvent.click(screen.getByRole('checkbox'));

      // Verify edit button is not present for completed todo
      const completedTodo = screen.getByText('Completed Tasks')
        .parentElement.querySelector('li');
      expect(within(completedTodo).queryByText('Edit')).not.toBeInTheDocument();
    });
  });
});
