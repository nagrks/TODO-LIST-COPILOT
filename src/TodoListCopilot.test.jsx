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

    test('should handle duplicate todo items', () => {
      const duplicateTodo = 'Duplicate Todo';
      
      // Add the same todo twice
      fireEvent.change(input, { target: { value: duplicateTodo } });
      fireEvent.click(addButton);
      fireEvent.change(input, { target: { value: duplicateTodo } });
      fireEvent.click(addButton);

      const duplicateTodos = screen.getAllByText(duplicateTodo);
      expect(duplicateTodos).toHaveLength(2);
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
  });
});
