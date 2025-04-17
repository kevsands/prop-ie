# Prop.ie API Documentation

## Overview

This document provides comprehensive documentation for the Prop.ie API, which powers the property development platform. The API follows RESTful principles and uses JSON for data exchange.

## Base URL

```
https://api.prop.ie
```

For development environments:
```
http://localhost:5000
```

## Authentication

### Authentication Methods

The API uses JWT (JSON Web Token) authentication. To authenticate requests, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Obtaining a Token

To obtain a JWT token, use the login endpoint:

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "buyer"
  }
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- `200 OK`: The request was successful
- `201 Created`: A resource was successfully created
- `400 Bad Request`: The request was invalid
- `401 Unauthorized`: Authentication failed
- `403 Forbidden`: The authenticated user doesn't have permission
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An error occurred on the server

Error responses include a JSON body with details:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "errors": [
    "Detailed error information (optional)"
  ]
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Limits are as follows:

- Anonymous requests: 60 requests per hour
- Authenticated requests: 1000 requests per hour

Rate limit information is included in the response headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1625097600
```

## API Endpoints

### Authentication

#### Register a new user

```
POST /api/auth/register
```

Request body:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "your_password",
  "phone": "+353 1 234 5678"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "buyer"
  }
}
```

#### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "buyer"
  }
}
```

#### Get current user profile

```
GET /api/auth/profile
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+353 1 234 5678",
    "role": "buyer",
    "verified": true,
    "createdAt": "2023-04-01T12:00:00.000Z"
  }
}
```

#### Update user profile

```
PUT /api/auth/profile
```

Request body:
```json
{
  "name": "John Smith",
  "phone": "+353 1 234 5679"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Smith",
    "email": "user@example.com",
    "phone": "+353 1 234 5679",
    "role": "buyer",
    "verified": true,
    "createdAt": "2023-04-01T12:00:00.000Z"
  }
}
```

#### Change password

```
POST /api/auth/password
```

Request body:
```json
{
  "currentPassword": "your_current_password",
  "newPassword": "your_new_password"
}
```

Response:
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

#### Request password reset

```
POST /api/auth/password/reset-request
```

Request body:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### Reset password

```
POST /api/auth/password/reset
```

Request body:
```json
{
  "token": "reset_token_from_email",
  "newPassword": "your_new_password"
}
```

Response:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Properties

#### Get all properties

```
GET /api/properties
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `location`: Filter by location
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `bedrooms`: Number of bedrooms
- `status`: Property status (available, reserved, sold)

Response:
```json
{
  "success": true,
  "count": 50,
  "pages": 5,
  "properties": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "title": "Luxury Apartment in City Center",
      "description": "Beautiful apartment with modern amenities",
      "price": 350000,
      "location": {
        "address": "123 Main Street",
        "city": "Dublin",
        "coordinates": {
          "lat": 53.349805,
          "lng": -6.26031
        }
      },
      "specifications": {
        "bedrooms": 2,
        "bathrooms": 2,
        "area": 85,
        "energyRating": "A"
      },
      "images": [
        "https://api.prop.ie/uploads/properties/image1.jpg",
        "https://api.prop.ie/uploads/properties/image2.jpg"
      ],
      "status": "available",
      "projectId": "60d21b4667d0d8992e610c86",
      "createdAt": "2023-04-01T12:00:00.000Z"
    },
    // More properties...
  ]
}
```

#### Get property by ID

```
GET /api/properties/:id
```

Response:
```json
{
  "success": true,
  "property": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "Luxury Apartment in City Center",
    "description": "Beautiful apartment with modern amenities",
    "price": 350000,
    "location": {
      "address": "123 Main Street",
      "city": "Dublin",
      "coordinates": {
        "lat": 53.349805,
        "lng": -6.26031
      }
    },
    "specifications": {
      "bedrooms": 2,
      "bathrooms": 2,
      "area": 85,
      "energyRating": "A"
    },
    "images": [
      "https://api.prop.ie/uploads/properties/image1.jpg",
      "https://api.prop.ie/uploads/properties/image2.jpg"
    ],
    "floorPlans": [
      "https://api.prop.ie/uploads/properties/floorplan1.jpg"
    ],
    "status": "available",
    "projectId": "60d21b4667d0d8992e610c86",
    "project": {
      "id": "60d21b4667d0d8992e610c86",
      "name": "City Center Development",
      "developer": "ABC Developers",
      "completionDate": "2024-06-30T00:00:00.000Z"
    },
    "createdAt": "2023-04-01T12:00:00.000Z"
  }
}
```

#### Create property (Admin only)

```
POST /api/properties
```

Request body:
```json
{
  "title": "New Luxury Apartment",
  "description": "Beautiful apartment with modern amenities",
  "price": 375000,
  "location": {
    "address": "456 High Street",
    "city": "Dublin",
    "coordinates": {
      "lat": 53.349805,
      "lng": -6.26031
    }
  },
  "specifications": {
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 95,
    "energyRating": "A"
  },
  "projectId": "60d21b4667d0d8992e610c86",
  "status": "available"
}
```

Response:
```json
{
  "success": true,
  "property": {
    "id": "60d21b4667d0d8992e610c87",
    "title": "New Luxury Apartment",
    "description": "Beautiful apartment with modern amenities",
    "price": 375000,
    "location": {
      "address": "456 High Street",
      "city": "Dublin",
      "coordinates": {
        "lat": 53.349805,
        "lng": -6.26031
      }
    },
    "specifications": {
      "bedrooms": 3,
      "bathrooms": 2,
      "area": 95,
      "energyRating": "A"
    },
    "images": [],
    "status": "available",
    "projectId": "60d21b4667d0d8992e610c86",
    "createdAt": "2023-04-01T12:00:00.000Z"
  }
}
```

#### Update property (Admin only)

```
PUT /api/properties/:id
```

Request body:
```json
{
  "price": 365000,
  "status": "reserved"
}
```

Response:
```json
{
  "success": true,
  "property": {
    "id": "60d21b4667d0d8992e610c87",
    "title": "New Luxury Apartment",
    "description": "Beautiful apartment with modern amenities",
    "price": 365000,
    "location": {
      "address": "456 High Street",
      "city": "Dublin",
      "coordinates": {
        "lat": 53.349805,
        "lng": -6.26031
      }
    },
    "specifications": {
      "bedrooms": 3,
      "bathrooms": 2,
      "area": 95,
      "energyRating": "A"
    },
    "images": [],
    "status": "reserved",
    "projectId": "60d21b4667d0d8992e610c86",
    "createdAt": "2023-04-01T12:00:00.000Z",
    "updatedAt": "2023-04-02T12:00:00.000Z"
  }
}
```

#### Delete property (Admin only)

```
DELETE /api/properties/:id
```

Response:
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

#### Upload property image (Admin only)

```
POST /api/properties/:id/images
```

Request body (multipart/form-data):
- `image`: Image file

Response:
```json
{
  "success": true,
  "imageUrl": "https://api.prop.ie/uploads/properties/image3.jpg",
  "property": {
    "id": "60d21b4667d0d8992e610c87",
    "images": [
      "https://api.prop.ie/uploads/properties/image3.jpg"
    ],
    // Other property fields...
  }
}
```

### Purchases

#### Get all purchases (for current user)

```
GET /api/purchases
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status

Response:
```json
{
  "success": true,
  "count": 2,
  "pages": 1,
  "purchases": [
    {
      "id": "60d21b4667d0d8992e610c88",
      "propertyId": "60d21b4667d0d8992e610c85",
      "property": {
        "id": "60d21b4667d0d8992e610c85",
        "title": "Luxury Apartment in City Center",
        "price": 350000,
        // Other property fields...
      },
      "status": "deposit_paid",
      "price": 350000,
      "depositAmount": 10000,
      "depositPaid": true,
      "depositDate": "2023-04-05T12:00:00.000Z",
      "createdAt": "2023-04-01T12:00:00.000Z"
    },
    // More purchases...
  ]
}
```

#### Get purchase by ID

```
GET /api/purchases/:id
```

Response:
```json
{
  "success": true,
  "purchase": {
    "id": "60d21b4667d0d8992e610c88",
    "propertyId": "60d21b4667d0d8992e610c85",
    "buyerId": "60d21b4667d0d8992e610c85",
    "status": "deposit_paid",
    "price": 350000,
    "depositAmount": 10000,
    "depositPaid": true,
    "depositDate": "2023-04-05T12:00:00.000Z",
    "documents": [
      {
        "type": "id_proof",
        "fileUrl": "https://api.prop.ie/uploads/documents/id_proof.pdf",
        "status": "approved",
        "notes": "Valid ID document",
        "uploadedAt": "2023-04-06T12:00:00.000Z"
      },
      {
        "type": "address_proof",
        "fileUrl": "https://api.prop.ie/uploads/documents/address_proof.pdf",
        "status": "pending",
        "uploadedAt": "2023-04-06T12:30:00.000Z"
      }
    ],
    "payments": [
      {
        "amount": 10000,
        "type": "deposit",
        "status": "completed",
        "dueDate": "2023-04-05T12:00:00.000Z",
        "paidDate": "2023-04-05T12:00:00.000Z",
        "reference": "DEP-10001"
      },
      {
        "amount": 340000,
        "type": "final",
        "status": "pending",
        "dueDate": "2023-07-01T12:00:00.000Z"
      }
    ],
    "property": {
      "id": "60d21b4667d0d8992e610c85",
      "title": "Luxury Apartment in City Center",
      // Other property fields...
    },
    "createdAt": "2023-04-01T12:00:00.000Z",
    "updatedAt": "2023-04-06T12:30:00.000Z"
  }
}
```

#### Create purchase

```
POST /api/purchases
```

Request body:
```json
{
  "propertyId": "60d21b4667d0d8992e610c85"
}
```

Response:
```json
{
  "success": true,
  "purchase": {
    "id": "60d21b4667d0d8992e610c88",
    "propertyId": "60d21b4667d0d8992e610c85",
    "buyerId": "60d21b4667d0d8992e610c85",
    "status": "initiated",
    "price": 350000,
    "depositAmount": 10000,
    "depositPaid": false,
    "documents": [],
    "payments": [
      {
        "amount": 10000,
        "type": "deposit",
        "status": "pending",
        "dueDate": "2023-04-15T12:00:00.000Z"
      },
      {
        "amount": 340000,
        "type": "final",
        "status": "pending",
        "dueDate": "2023-07-01T12:00:00.000Z"
      }
    ],
    "property": {
      "id": "60d21b4667d0d8992e610c85",
      "title": "Luxury Apartment in City Center",
      // Other property fields...
    },
    "createdAt": "2023-04-01T12:00:00.000Z"
  }
}
```

#### Update purchase status (Admin only)

```
PUT /api/purchases/:id/status
```

Request body:
```json
{
  "status": "documents_approved",
  "notes": "All documents have been verified and approved"
}
```

Response:
```json
{
  "success": true,
  "purchase": {
    "id": "60d21b4667d0d8992e610c88",
    "status": "documents_approved",
    // Other purchase fields...
    "updatedAt": "2023-04-10T12:00:00.000Z"
  }
}
```

### Documents

#### Upload document

```
POST /api/purchases/:id/documents
```

Request body (multipart/form-data):
- `document`: Document file
- `type`: Document type (id_proof, address_proof, mortgage_approval, etc.)
- `notes`: Additional notes (optional)

Response:
```json
{
  "success": true,
  "document": {
    "type": "mortgage_approval",
    "fileUrl": "https://api.prop.ie/uploads/documents/mortgage_approval.pdf",
    "status": "pending",
    "notes": "Mortgage approval from Bank XYZ",
    "uploadedAt": "2023-04-10T12:00:00.000Z"
  },
  "purchase": {
    "id": "60d21b4667d0d8992e610c88",
    // Other purchase fields...
  }
}
```

#### Get all documents (Admin only)

```
GET /api/documents
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (pending, approved, rejected)
- `type`: Filter by document type

Response:
```json
{
  "success": true,
  "count": 25,
  "pages": 3,
  "documents": [
    {
      "id": "60d21b4667d0d8992e610c89",
      "type": "id_proof",
      "fileUrl": "https://api.prop.ie/uploads/documents/id_proof.pdf",
      "status": "pending",
      "notes": "Passport",
      "uploadedAt": "2023-04-06T12:00:00.000Z",
      "purchase": {
        "id": "60d21b4667d0d8992e610c88",
        "propertyId": "60d21b4667d0d8992e610c85",
        "buyerId": "60d21b4667d0d8992e610c85"
      },
      "buyer": {
        "id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "email": "user@example.com"
      }
    },
    // More documents...
  ]
}
```

#### Update document status (Admin only)

```
PUT /api/documents/:id/status
```

Request body:
```json
{
  "status": "approved",
  "notes": "Document verified and approved"
}
```

Response:
```json
{
  "success": true,
  "document": {
    "id": "60d21b4667d0d8992e610c89",
    "type": "id_proof",
    "fileUrl": "https://api.prop.ie/uploads/documents/id_proof.pdf",
    "status": "approved",
    "notes": "Document verified and approved",
    "uploadedAt": "2023-04-06T12:00:00.000Z",
    "updatedAt": "2023-04-10T12:00:00.000Z"
  }
}
```

### Payments

#### Process payment

```
POST /api/purchases/:id/payments/:paymentId/process
```

Request body:
```json
{
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardNumber": "4111111111111111",
    "expiryMonth": "12",
    "expiryYear": "2025",
    "cvv": "123"
  }
}
```

Response:
```json
{
  "success": true,
  "payment": {
    "amount": 10000,
    "type": "deposit",
    "status": "completed",
    "dueDate": "2023-04-15T12:00:00.000Z",
    "paidDate": "2023-04-10T12:00:00.000Z",
    "reference": "DEP-10002"
  },
  "purchase": {
    "id": "60d21b4667d0d8992e610c88",
    "depositPaid": true,
    "depositDate": "2023-04-10T12:00:00.000Z",
    "status": "deposit_paid",
    // Other purchase fields...
  }
}
```

#### Update payment status (Admin only)

```
PUT /api/payments/:id/status
```

Request body:
```json
{
  "status": "completed",
  "reference": "BANK-TRANSFER-12345",
  "notes": "Bank transfer received"
}
```

Response:
```json
{
  "success": true,
  "payment": {
    "amount": 10000,
    "type": "deposit",
    "status": "completed",
    "dueDate": "2023-04-15T12:00:00.000Z",
    "paidDate": "2023-04-10T12:00:00.000Z",
    "reference": "BANK-TRANSFER-12345",
    "notes": "Bank transfer received"
  }
}
```

### Projects (Admin only)

#### Get all projects

```
GET /api/projects
```

Response:
```json
{
  "success": true,
  "projects": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "name": "City Center Development",
      "description": "Modern apartments in the heart of the city",
      "developer": "ABC Developers",
      "location": {
        "address": "Main Street",
        "city": "Dublin",
        "coordinates": {
          "lat": 53.349805,
          "lng": -6.26031
        }
      },
      "startDate": "2022-01-01T00:00:00.000Z",
      "completionDate": "2024-06-30T00:00:00.000Z",
      "status": "in_progress",
      "propertyCount": 24,
      "createdAt": "2022-01-01T00:00:00.000Z"
    },
    // More projects...
  ]
}
```

#### Create project

```
POST /api/projects
```

Request body:
```json
{
  "name": "Riverside Apartments",
  "description": "Luxury apartments with river views",
  "developer": "XYZ Developers",
  "location": {
    "address": "River Road",
    "city": "Cork",
    "coordinates": {
      "lat": 51.896892,
      "lng": -8.486316
    }
  },
  "startDate": "2023-06-01T00:00:00.000Z",
  "completionDate": "2025-12-31T00:00:00.000Z",
  "status": "planning"
}
```

Response:
```json
{
  "success": true,
  "project": {
    "id": "60d21b4667d0d8992e610c90",
    "name": "Riverside Apartments",
    "description": "Luxury apartments with river views",
    "developer": "XYZ Developers",
    "location": {
      "address": "River Road",
      "city": "Cork",
      "coordinates": {
        "lat": 51.896892,
        "lng": -8.486316
      }
    },
    "startDate": "2023-06-01T00:00:00.000Z",
    "completionDate": "2025-12-31T00:00:00.000Z",
    "status": "planning",
    "propertyCount": 0,
    "createdAt": "2023-04-10T12:00:00.000Z"
  }
}
```

### Users (Admin only)

#### Get all users

```
GET /api/users
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `role`: Filter by role (buyer, admin)
- `verified`: Filter by verification status (true, false)

Response:
```json
{
  "success": true,
  "count": 50,
  "pages": 5,
  "users": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "buyer",
      "verified": true,
      "createdAt": "2023-04-01T12:00:00.000Z"
    },
    // More users...
  ]
}
```

#### Create admin user

```
POST /api/users/admin
```

Request body:
```json
{
  "name": "Admin User",
  "email": "admin@prop.ie",
  "password": "secure_password",
  "role": "admin"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "60d21b4667d0d8992e610c91",
    "name": "Admin User",
    "email": "admin@prop.ie",
    "role": "admin",
    "verified": true,
    "createdAt": "2023-04-10T12:00:00.000Z"
  }
}
```

## WebSocket API

The Prop.ie platform also provides real-time updates via WebSocket connections using Socket.IO.

### Connection

Connect to the WebSocket server:

```javascript
const socket = io('https://api.prop.ie', {
  query: {
    userId: 'user_id',
    role: 'buyer'
  }
});
```

### Events

#### Document Updates

Listen for document status updates:

```javascript
socket.on('document_update', (data) => {
  console.log('Document update:', data);
  // {
  //   documentId: '60d21b4667d0d8992e610c89',
  //   filename: 'id_proof.pdf',
  //   status: 'approved',
  //   message: 'Your document has been approved'
  // }
});
```

#### Payment Updates

Listen for payment status updates:

```javascript
socket.on('payment_update', (data) => {
  console.log('Payment update:', data);
  // {
  //   paymentId: '60d21b4667d0d8992e610c92',
  //   amount: 10000,
  //   status: 'completed',
  //   message: 'Your payment has been processed successfully'
  // }
});
```

#### Property Updates

Listen for property status changes:

```javascript
socket.on('property_update', (data) => {
  console.log('Property update:', data);
  // {
  //   propertyId: '60d21b4667d0d8992e610c85',
  //   propertyName: 'Luxury Apartment in City Center',
  //   status: 'reserved'
  // }
});
```

#### Chat Messages

Send a message:

```javascript
socket.emit('send_message', {
  purchaseId: '60d21b4667d0d8992e610c88',
  senderId: '60d21b4667d0d8992e610c85',
  senderName: 'John Doe',
  message: 'Hello, I have a question about the property',
  timestamp: new Date().toISOString()
});
```

Receive messages:

```javascript
socket.on('new_message', (message) => {
  console.log('New message:', message);
  // {
  //   id: 'msg-123',
  //   purchaseId: '60d21b4667d0d8992e610c88',
  //   senderId: '60d21b4667d0d8992e610c93',
  //   senderName: 'Admin User',
  //   message: 'Hello, how can I help you?',
  //   timestamp: '2023-04-10T12:30:00.000Z',
  //   read: false
  // }
});
```

#### Typing Indicator

Send typing indicator:

```javascript
socket.emit('typing', {
  purchaseId: '60d21b4667d0d8992e610c88',
  user: 'John Doe'
});
```

Receive typing indicator:

```javascript
socket.on('typing', (data) => {
  console.log(`${data.user} is typing...`);
});
```

## Versioning

The API is versioned to ensure backward compatibility. The current version is v1.

Future versions will be accessible via:
```
https://api.prop.ie/v2/...
```

## Support

For API support, please contact:
- Email: api-support@prop.ie
- Documentation: https://docs.prop.ie/api
