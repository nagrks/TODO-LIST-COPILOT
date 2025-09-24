# TodoList Copilot

A modern, accessible, and feature-rich Todo List application built with React and Vite. This application demonstrates best practices in React development, including proper state management, accessibility features, and comprehensive testing.

## Features

- ✨ Clean and intuitive user interface
- ⌨️ Full keyboard support
- 🔍 Accessibility-first design
- 📱 Responsive layout
- 🧪 Comprehensive test coverage

### Functionality

- Task Organization:
  - Separate sections for active and completed tasks
  - Automatic task movement between sections
  - Clean visual separation of sections
  - Completion status preserved when moving tasks

- Task Management:
  - Add new todos with text input
  - Edit existing active todos
  - Remove todos from any section
  - Toggle completion with checkboxes

- Smart Input Validation:
  - Alphanumeric characters only (letters and numbers)
  - Automatic first letter capitalization
  - Whitespace trimming
  - Duplicate prevention (case-insensitive)

- User Experience:
  - Form submission with Enter key
  - Auto-focus on input fields
  - Clear validation messages
  - Edit/Cancel/Save options for active tasks
  - Proper handling of long text

### Technical Features

- React Hooks for state management
- Vite for fast development and building
- Modern JavaScript features
- Accessibility:
  - ARIA labels for all interactive elements
  - Screen reader-friendly announcements
  - Keyboard navigation support
- Comprehensive Jest test suite:
  - Input validation tests
  - Duplicate prevention tests
  - Editing functionality tests
  - Accessibility compliance tests
- Git version control:
  - Semantic commit messages
  - Feature-based commits
  - Clean commit history
- Proper error handling and validation
- Responsive CSS styling
- Focus management
- XSS prevention

## Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to project directory
cd todo-list-copilot

# Install dependencies
npm install

# Start development server
npm run dev
```

## Testing

The application includes a comprehensive test suite that covers various aspects of functionality:

```bash
# Run tests
npm test

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

#### Initial Rendering
- Empty state validation
- Auto-focus functionality
- Header rendering

#### Adding Todos
- Keyboard interaction (Enter key)
- Special characters handling
- Emoji support
- Whitespace trimming
- Long text handling

#### Todo Management
- Order preservation during deletion
- Rapid add/delete operations
- XSS prevention
- Duplicate todo handling

#### Accessibility
- ARIA labels
- Focus management
- Keyboard navigation

## Development

### Project Structure

```
todo-list-copilot/
├── src/
│   ├── TodoListCopilot.jsx    # Main component
│   ├── TodoListCopilot.test.jsx # Test suite
│   └── App.jsx               # App wrapper
├── public/                   # Static assets
└── package.json             # Dependencies and scripts
```

### Component API Documentation

#### TodoListCopilot

The main component that implements the todo list functionality.

**Props:**
- None (self-contained component)

**State:**
```javascript
const [todos, setTodos] = useState([]); // Array of todo items
const [input, setInput] = useState(""); // Current input field value
```

**Key Methods:**
```javascript
addTodo(e: FormEvent): void      // Adds a new todo item
removeTodo(index: number): void  // Removes a todo by index
handleKeyPress(e: KeyboardEvent): void  // Handles keyboard events
```

## Accessibility Features

The application follows WCAG guidelines and includes:
- Semantic HTML structure
- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Focus management
- Screen reader-friendly content
- Clear button purposes and labels

## Technologies Used

- React 19
- Vite
- Jest + React Testing Library
- ESLint
- Babel

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm test        # Run tests
npm run lint    # Run ESLint
```

## Validation Rules

The application enforces the following validation rules for todo items:

1. Character Restrictions:
   - Only letters (a-z, A-Z), numbers (0-9), and spaces are allowed
   - Special characters and emojis are automatically removed
   - First letter is automatically capitalized
   - Rest of the text is converted to lowercase

2. Duplicate Prevention:
   - Case-insensitive duplicate detection
   - Prevents adding duplicate todos
   - Prevents editing a todo to match an existing one
   - Clear error messages for duplicate attempts

3. Input Cleaning:
   - Trims leading and trailing whitespace
   - Empty todos are not allowed
   - Maintains proper spacing between words

## Version History

### Version 1.0.0
- Initial release with basic todo functionality
- Add, delete, and complete todos
- Basic validation and accessibility

### Version 1.1.0
- Added todo item editing
- Improved accessibility features
- Enhanced test coverage

### Version 1.2.0
- Implemented alphanumeric character restriction
- Added automatic text formatting
- Enhanced validation messages

### Version 1.3.0
- Added case-insensitive duplicate prevention
- Enhanced edit mode validation
- Updated documentation

### Version 1.4.0
- Added separate sections for active and completed tasks
- Automatic task movement on status change
- Enhanced UI with section headers
- Limited editing to active tasks only
