# Prop.ie Platform - Developer Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Development Environment Setup](#development-environment-setup)
5. [Project Structure](#project-structure)
6. [Frontend Development](#frontend-development)
7. [Backend Development](#backend-development)
8. [Authentication System](#authentication-system)
9. [Database Schema](#database-schema)
10. [API Documentation](#api-documentation)
11. [Real-time Communication](#real-time-communication)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Contributing Guidelines](#contributing-guidelines)

## Introduction

This documentation is intended for developers who will be working on the Prop.ie platform. It provides comprehensive information about the system architecture, development practices, and technical details necessary for maintaining and extending the platform.

Prop.ie is an enterprise-grade property development platform that facilitates off-plan property purchases with secure buyer login, document management, and compliance controls. This document will help you understand the technical foundations of the platform and guide you through the development process.

## Architecture Overview

Prop.ie follows a modern microservices architecture with a clear separation between frontend and backend components:

### System Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client         │     │  API Gateway    │     │  Authentication │
│  (Next.js)      │◄───►│  (Express)      │◄───►│  Service        │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
      ┌──────────▼─────┐ ┌───────▼────────┐ ┌───▼──────────────┐
      │                │ │                │ │                  │
      │  Property      │ │  Document      │ │  Financial       │
      │  Service       │ │  Service       │ │  Service         │
      │                │ │                │ │                  │
      └──────────┬─────┘ └───────┬────────┘ └───┬──────────────┘
                 │               │               │
                 │               │               │
      ┌──────────▼───────────────▼───────────────▼──────────────┐
      │                                                         │
      │                      MongoDB                            │
      │                                                         │
      └─────────────────────────────────────────────────────────┘
```

### Key Components

- **Frontend**: React/Next.js application providing the user interface
- **Backend API**: Express.js REST API handling business logic
- **Database**: MongoDB for data storage
- **Authentication**: JWT-based authentication system
- **Real-time Communication**: Socket.IO for notifications and messaging
- **File Storage**: Document storage and management system

## Technology Stack

### Frontend
- **Framework**: Next.js with React
- **Language**: TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **API Client**: Axios
- **Real-time**: Socket.IO Client

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database ORM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Real-time**: Socket.IO
- **File Handling**: Multer

### Database
- **Primary Database**: MongoDB
- **Schema Management**: Mongoose schemas

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Version Control**: Git
- **CI/CD**: (Configurable based on deployment environment)

## Development Environment Setup

### Prerequisites
- Node.js (v16+)
- npm (v7+)
- Docker and Docker Compose
- Git
- MongoDB (local or Docker)

### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-organization/prop-ie.git
cd prop-ie
```

2. Set up the frontend:
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Set up the backend:
```bash
cd ../backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development environment:
```bash
# In the root directory
docker-compose -f docker/docker-compose.dev.yml up
```

Alternatively, you can run the services individually:

```bash
# Frontend (in the frontend directory)
npm run dev

# Backend (in the backend directory)
npm run dev
```

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

#### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/prop-ie
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
FRONTEND_URL=http://localhost:3000
```

## Project Structure

### Frontend Structure

```
frontend/
├── public/            # Static assets
├── src/
│   ├── components/    # React components
│   │   ├── auth/      # Authentication components
│   │   ├── buyer/     # Buyer-specific components
│   │   ├── layout/    # Layout components
│   │   ├── property/  # Property-related components
│   │   └── ui/        # Reusable UI components
│   ├── context/       # React context providers
│   ├── pages/         # Next.js pages
│   │   ├── admin/     # Admin pages
│   │   ├── auth/      # Authentication pages
│   │   ├── buyer/     # Buyer dashboard pages
│   │   └── property/  # Property pages
│   ├── api/           # API integration
│   ├── hooks/         # Custom React hooks
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── .eslintrc.js       # ESLint configuration
├── next.config.js     # Next.js configuration
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

### Backend Structure

```
backend/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Express middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   └── server.ts      # Server entry point
├── .eslintrc.js       # ESLint configuration
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## Frontend Development

### Component Architecture

The frontend follows a component-based architecture with:

- **Page Components**: Next.js pages that define routes
- **Layout Components**: Define the structure of pages
- **Feature Components**: Implement specific features
- **UI Components**: Reusable UI elements

### State Management

State is managed using React Context API with custom hooks:

- **AuthContext**: Manages authentication state
- **NotificationContext**: Handles real-time notifications
- **Component-level state**: Using React's useState and useReducer

### Routing

Routing is handled by Next.js with:

- File-based routing in the `pages` directory
- Dynamic routes for property details, user profiles, etc.
- Protected routes using the `ProtectedRoute` component

### API Integration

API calls are centralized in the `api` directory:

```typescript
// Example API call
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProperties = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/api/properties`, { 
      params: filters,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Styling

Styling is implemented using Tailwind CSS:

- Utility-first approach
- Custom components extend Tailwind classes
- Responsive design patterns

## Backend Development

### API Structure

The backend follows a RESTful API structure:

- **Routes**: Define API endpoints
- **Controllers**: Handle request logic
- **Models**: Define data structure
- **Middleware**: Process requests

### Middleware

Common middleware includes:

- **Authentication**: Verifies JWT tokens
- **Error Handling**: Processes and formats errors
- **Validation**: Validates request data
- **Logging**: Records API activity

### Request Flow

```
Client Request → Route → Middleware → Controller → Model → Response
```

### Error Handling

Errors are handled consistently using a central error handler:

```typescript
// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
```

## Authentication System

### Authentication Flow

1. User submits credentials
2. Server validates credentials
3. Server generates JWT token
4. Token is returned to client
5. Client stores token in localStorage
6. Token is included in subsequent requests

### JWT Implementation

```typescript
// Generate token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );
};

// Verify token middleware
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};
```

### Role-Based Access Control

Access control is implemented using role-based middleware:

```typescript
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: Admin privileges required' 
    });
  }
  next();
};
```

## Database Schema

### User Schema

```typescript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'admin'], default: 'buyer' },
  phone: { type: String },
  address: { type: String },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Property Schema

```typescript
const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  specifications: {
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    energyRating: { type: String }
  },
  images: [{ type: String }],
  floorPlans: [{ type: String }],
  status: { 
    type: String, 
    enum: ['available', 'reserved', 'sold'], 
    default: 'available' 
  },
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Purchase Schema

```typescript
const PurchaseSchema = new mongoose.Schema({
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true 
  },
  buyerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['initiated', 'deposit_paid', 'documents_submitted', 'documents_approved', 'contract_signed', 'completed', 'cancelled'], 
    default: 'initiated' 
  },
  price: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  depositPaid: { type: Boolean, default: false },
  depositDate: { type: Date },
  documents: [{
    type: { type: String },
    fileUrl: { type: String },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    notes: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  payments: [{
    amount: { type: Number },
    type: { 
      type: String, 
      enum: ['deposit', 'installment', 'final'], 
    },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed'], 
      default: 'pending' 
    },
    dueDate: { type: Date },
    paidDate: { type: Date },
    reference: { type: String }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
PUT /api/auth/profile
POST /api/auth/password/reset
```

### Property Endpoints

```
GET /api/properties
GET /api/properties/:id
POST /api/properties (admin)
PUT /api/properties/:id (admin)
DELETE /api/properties/:id (admin)
```

### Purchase Endpoints

```
GET /api/purchases
GET /api/purchases/:id
POST /api/purchases
PUT /api/purchases/:id
POST /api/purchases/:id/documents
GET /api/purchases/:id/documents
PUT /api/purchases/:id/documents/:documentId
POST /api/purchases/:id/payments
GET /api/purchases/:id/payments
```

### Document Endpoints

```
POST /api/documents
GET /api/documents
GET /api/documents/:id
PUT /api/documents/:id/status
```

## Real-time Communication

### Socket.IO Implementation

The platform uses Socket.IO for real-time features:

```typescript
// Server-side setup
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  const { userId, role } = socket.handshake.query;
  
  // Join user to their specific room
  socket.join(`user-${userId}`);
  
  // Handle document updates
  socket.on('document_update', (data) => {
    io.to(`user-${data.userId}`).emit('document_update', {
      documentId: data.documentId,
      status: data.status
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
```

### Client-side Integration

```typescript
// Client-side setup
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const useSocketConnection = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      query: {
        userId: user.id,
        role: user.role
      }
    });
    
    socket.on('document_update', (data) => {
      console.log('Document update:', data);
      // Handle document update
    });
    
    return () => {
      socket.disconnect();
    };
  }, [user]);
};
```

## Testing

### Testing Strategy

The platform employs a comprehensive testing strategy:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database interactions
- **End-to-End Tests**: Test complete user flows

### Frontend Testing

Frontend tests use Jest and React Testing Library:

```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  test('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  test('handles form submission', async () => {
    const mockLogin = jest.fn();
    render(<LoginForm onSubmit={mockLogin} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

### Backend Testing

Backend tests use Jest and Supertest:

```typescript
// Example API test
import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

describe('Auth API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.TEST_MONGODB_URI);
  });
  
  afterAll(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });
  
  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });
  
  test('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });
});
```

## Deployment

### Docker Deployment

The platform is containerized using Docker:

```bash
# Build and start containers
docker-compose -f docker/docker-compose.yml build
docker-compose -f docker/docker-compose.yml up -d
```

### Environment Configuration

Configure environment variables for different environments:

- Development: `.env.development`
- Staging: `.env.staging`
- Production: `.env.production`

### Database Migration

Database migrations are handled through Mongoose schemas and a migration script:

```bash
# Run database migrations
npm run migrate
```

### Monitoring and Logging

The platform includes monitoring and logging:

- Application logs using Winston
- Performance monitoring using Prometheus (optional)
- Error tracking using Sentry (optional)

## Contributing Guidelines

### Code Style

- Follow the ESLint configuration
- Use TypeScript for type safety
- Follow the project's naming conventions

### Git Workflow

1. Create a feature branch from `develop`
2. Make changes and commit with descriptive messages
3. Push branch and create a pull request
4. Request code review
5. Merge to `develop` after approval

### Commit Message Format

```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

### Pull Request Process

1. Ensure all tests pass
2. Update documentation if necessary
3. Get at least one code review approval
4. Merge using squash and merge

---

This documentation is maintained by the Prop.ie development team. For questions or clarifications, please contact the technical team.
