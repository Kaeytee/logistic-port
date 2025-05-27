# Client Requirements Documentation

**Version:** 1.0.0  
**Date:** 2025-05-27  
**Author:** Senior Software Engineer

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Business Logic](#business-logic)
7. [Validation Rules](#validation-rules)
8. [Error Handling](#error-handling)
9. [Performance Requirements](#performance-requirements)
10. [Security Requirements](#security-requirements)
11. [Integration Requirements](#integration-requirements)

## Introduction

This document outlines the backend requirements for the Logistics Portfolio application. The application is a logistics management system that allows clients to submit shipment requests, track packages, and manage their shipment history. The backend services described here should support all frontend functionalities while maintaining clean code architecture and following OOP best practices.

### Application Overview

The Logistics Portfolio is built as a Next.js application with the following main features:
- Client dashboard with quick access to core functionalities
- Simplified shipment submission flow
- Shipment tracking and history
- Awaiting deliveries management
- User authentication and profile management

## System Architecture

The backend should follow a clean architecture approach with the following layers:
- **Presentation Layer**: API Controllers/Endpoints
- **Business Logic Layer**: Services implementing core business rules
- **Data Access Layer**: Repositories for database operations
- **Domain Layer**: Entity models and business rules

### Technology Stack Recommendations
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js or NestJS
- **Database**: PostgreSQL (primary), Redis (caching)
- **Authentication**: JWT with refresh token mechanism
- **Documentation**: OpenAPI/Swagger

## Database Schema

### Core Entities

#### 1. User
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip VARCHAR(20),
    country VARCHAR(100),
    profile_image_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

#### 2. Shipment
```sql
CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    tracking_code VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    
    -- Client (Recipient) Information
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    client_address TEXT,
    client_city VARCHAR(100),
    client_state VARCHAR(100),
    client_zip VARCHAR(20),
    client_country VARCHAR(100),
    
    -- Origin Information
    origin_country VARCHAR(100) NOT NULL,
    origin_city VARCHAR(100),
    origin_address TEXT,
    origin_state VARCHAR(100),
    origin_contact_name VARCHAR(255),
    
    -- Package Details
    freight_type VARCHAR(50) NOT NULL,
    package_type VARCHAR(50) NOT NULL,
    package_category VARCHAR(50) NOT NULL,
    package_description TEXT NOT NULL,
    package_weight VARCHAR(50),
    package_value DECIMAL(10,2),
    package_note TEXT,
    
    -- Status and Tracking
    status VARCHAR(50) NOT NULL,
    estimated_arrival TIMESTAMP,
    actual_arrival TIMESTAMP,
    items_count INTEGER DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. ShipmentStatusHistory
```sql
CREATE TABLE shipment_status_history (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER REFERENCES shipments(id),
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. Address
```sql
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    address_type VARCHAR(50) NOT NULL, -- 'home', 'work', 'other'
    full_name VARCHAR(255),
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    zip VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. Notification
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    shipment_id INTEGER REFERENCES shipments(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    notification_type VARCHAR(50) NOT NULL, -- 'status_update', 'delivery', 'reminder', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email/:token` - Verify email with token
- `GET /api/auth/me` - Get current user profile

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `POST /api/users/profile-image` - Upload profile image

### Shipment Management
- `POST /api/shipments` - Create new shipment
- `GET /api/shipments` - List all shipments for current user
- `GET /api/shipments/awaiting` - List awaiting shipments
- `GET /api/shipments/history` - List shipment history
- `GET /api/shipments/:trackingCode` - Get shipment details by tracking code
- `GET /api/shipments/:id` - Get shipment details by ID (admin only)
- `PUT /api/shipments/:id/status` - Update shipment status (admin only)

### Address Management
- `GET /api/addresses` - List all addresses for current user
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address
- `PUT /api/addresses/:id/default` - Set address as default

### Notifications
- `GET /api/notifications` - List all notifications for current user
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification

### Tracking
- `GET /api/track/:trackingCode` - Track shipment by tracking code (public)

## Authentication

### JWT Authentication Flow
1. User authenticates with email/password and receives JWT access token and refresh token
2. Access token is included in Authorization header for all authenticated requests
3. When access token expires, use refresh token to get a new access token
4. Implement token revocation on logout

### Required Fields for Authentication
- Login: `email`, `password`, `rememberMe` (boolean)
- Registration: `email`, `password`, `fullName`, `phone` (optional)

### Token Structure
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

## Business Logic

### Shipment Submission Flow
1. Client fills out package origin and details form
2. System validates input data
3. System generates a unique tracking code
4. System creates shipment record with status "PENDING"
5. System sends confirmation email to client
6. System creates first status history record

### Shipment Status Flow
The shipment status follows this progression:
1. **PENDING**: Initial state after submission
2. **RECEIVED**: Package received at origin warehouse
3. **IN_TRANSIT**: Package in transit to destination
4. **ARRIVED**: Package arrived at destination warehouse
5. **DELIVERED**: Package delivered to recipient

### Address Auto-completion
Implement integration with OpenStreetMap API for address auto-completion:
- Endpoint: `https://nominatim.openstreetmap.org/search`
- Parameters: `format=jsonv2&q={query}&countrycodes=1`

## Validation Rules

### User Validation
- Email: Valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Password: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number
- Phone: Valid international phone format

### Shipment Validation
- Origin Country: Required
- Package Type: Required, must be one of predefined types
- Package Category: Required, must be one of predefined categories
- Package Description: Required, minimum 10 characters
- Freight Type: Required, default to 'air'

## Error Handling

Implement standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "clientEmail",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Error Codes
- `AUTHENTICATION_ERROR`: Authentication failed
- `AUTHORIZATION_ERROR`: User not authorized for action
- `VALIDATION_ERROR`: Input validation failed
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `SERVER_ERROR`: Internal server error

## Performance Requirements

1. API response time should be under 200ms for most endpoints
2. Support handling at least 100 concurrent users
3. Implement pagination for list endpoints (default page size: 10)
4. Implement caching for frequently accessed data (shipment details, tracking info)
5. Database queries should be optimized with proper indexing

## Security Requirements

1. Implement rate limiting to prevent brute force attacks
2. Store passwords using bcrypt with appropriate salt rounds
3. Implement CORS with proper origin restrictions
4. Sanitize all user inputs to prevent SQL injection and XSS
5. Use HTTPS for all communications
6. Implement proper input validation on all endpoints
7. Log all authentication events and sensitive operations

## Integration Requirements

### Email Service
- Implement email notifications for:
  - Shipment submission confirmation
  - Status updates
  - Delivery confirmation
  - Account verification
  - Password reset

### SMS Notifications (Optional)
- Implement SMS notifications for critical status updates

### External APIs
1. **OpenStreetMap API**: For address auto-completion
   - Endpoint: `https://nominatim.openstreetmap.org/search`
   
2. **Payment Gateway** (if applicable):
   - Support for major payment processors
   - Secure handling of payment information

3. **Analytics Integration**:
   - Track shipment metrics
   - Monitor user engagement

## Development Guidelines

1. Follow RESTful API design principles
2. Document all endpoints with OpenAPI/Swagger
3. Write unit tests for all business logic functions
4. Implement logging for debugging and monitoring
5. Use environment variables for all configuration
6. Follow OOP principles and clean code architecture
7. Implement database migrations for schema changes
8. Document all database schema changes

---

This document serves as a comprehensive guide for backend developers to implement the required services, APIs, and database schema for the Logistics Portfolio application. It should be updated as requirements evolve.
