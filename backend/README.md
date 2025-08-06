# E-Library Book Management System - Backend

A secure Node.js/Express backend for the E-Library Book Management System with JWT authentication and role-based access control.

## Features

- **Secure Authentication**: JWT-based authentication with password hashing
- **Role-Based Access Control**: User, Staff, and Admin roles
- **User Management**: Registration, login, profile updates, password changes
- **Input Validation**: Comprehensive form validation using express-validator
- **Error Handling**: Proper error handling and user-friendly messages
- **Database Integration**: MongoDB with Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Copy `config.env` and update the values:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/elibrary
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   NODE_ENV=development
   ```

4. **Start MongoDB:**

   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas cloud service

5. **Run the server:**

   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### POST `/api/auth/signup`

Register a new user account.

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "role": "user"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/login`

Authenticate user and get access token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### POST `/api/auth/logout`

Logout user (client-side token removal).

**Headers:**

```
Authorization: Bearer jwt_token_here
```

#### GET `/api/auth/profile`

Get current user profile.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

#### PUT `/api/auth/profile`

Update user profile.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+1234567890"
}
```

#### POST `/api/auth/change-password`

Change user password.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

## Database Schema

### User Model

```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['user', 'staff', 'admin']),
  firstName: String (required),
  lastName: String (required),
  phoneNumber: String (optional),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Password Hashing**: Using bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **Role-Based Access**: Different permissions for different user roles
- **Account Status**: Active/inactive account management

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email"
    }
  ]
}
```

## Development

### Project Structure

```
backend/
├── config.env          # Environment variables
├── package.json        # Dependencies and scripts
├── server.js          # Main server file
├── models/
│   └── User.js        # User model
├── routes/
│   └── auth.js        # Authentication routes
└── middleware/
    └── auth.js        # Authentication middleware
```

### Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (to be implemented)

## Production Deployment

1. **Update environment variables:**

   - Set `NODE_ENV=production`
   - Use a strong `JWT_SECRET`
   - Configure production MongoDB URI

2. **Security considerations:**

   - Use HTTPS in production
   - Implement rate limiting
   - Add CORS configuration for production domains
   - Set up proper logging

3. **Deploy to your preferred platform:**
   - Heroku
   - AWS
   - DigitalOcean
   - Vercel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
