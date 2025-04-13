# Todo Application

## Tech Stack

### Frontend
- **Next.js 14**: React framework for building the user interface
- **TypeScript**: For type safety and better developer experience
- **Redux Toolkit**: For state management
- **Tailwind CSS**: For styling and responsive design
- **React Icons**: For consistent iconography

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Design Decisions

### State Management
- Used Redux Toolkit for centralized state management
- Implemented slices for todos, users, and filters
- Optimized performance with memoization and selective updates

### UI/UX Design
- Modern, clean interface with consistent styling
- Responsive design for all screen sizes
- Intuitive navigation and user flows
- Clear visual feedback for user actions
- Custom checkbox implementation for better UX


## Features

### Core Features
1. **Todo Management**
   - Create, read, update, and delete todos
   - Mark todos as complete/incomplete
   - Add descriptions and notes
   - Set priority levels
   - Add tags for categorization

2. **User Management**
   - User authentication
   - User switching functionality
   - Assign todos to users

3. **Filtering and Search**
   - Filter by priority
   - Filter by tags
   - Search todos by title
   - Pagination support

4. **Export Functionality**
   - Export todos to CSV format

### Additional Features
1. **Responsive Design**
   - Mobile-first approach
   - Adaptive layouts for different screen sizes
   - Touch-friendly interactions

2. **Enhanced UI Components**
   - Custom checkbox implementation
   - Modal dialogs for add/edit operations
   - Tag and user badges
   - Priority indicators with color coding

3. **Performance Optimizations**
   - Memoized components
   - Optimized re-renders
   - Efficient state updates

## Setup Scripts

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Production
```bash
# Start production server
npm start

# Build and start
npm run build && npm start
```
