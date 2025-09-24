# TodoList Copilot

A modern, accessible, and feature-rich Todo List application built with React and Vite. This application demonstrates best practices in React development, including proper state management, accessibility features, and comprehensive testing.

## Features

- ✨ Clean and intuitive user interface
- ⌨️ Full keyboard support
- 🔍 Accessibility-first design
- 📱 Responsive layout
- 🧪 Comprehensive test coverage

### Functionality

- Add todos with text input
- Remove individual todos
- Auto-focus on input field for better UX
- Support for special characters and emojis
- Proper handling of long text
- Form submission with Enter key
- Input validation and whitespace trimming

### Technical Features

- React Hooks for state management
- Vite for fast development and building
- Modern JavaScript features
- ARIA labels for accessibility
- Comprehensive Jest test suite
- Proper event handling
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
