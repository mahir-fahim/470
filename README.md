# E-Library Book Management System

A comprehensive MERN stack application for managing library operations with secure authentication, role-based access control, and modern UI/UX design.

## 🚀 Features

### Authentication & User Management

- **Secure Login/Signup**: JWT-based authentication with password hashing
- **Role-Based Access**: User, Staff, and Admin roles with different permissions
- **Profile Management**: Update user information and change passwords
- **Session Management**: Automatic token validation and logout functionality

### Planned Features (Next Phase)

- **Book Management**: Add, edit, and delete book entries
- **Inventory Tracking**: Monitor book availability and copies
- **Search & Filter**: Find books by title, author, ISBN, or category
- **Issue & Return**: Manage book borrowing and returns
- **Due Date Tracking**: Calculate fines for late returns
- **User History**: Track all books borrowed and returned
- **Reservations**: Reserve books that are currently issued
- **Category Management**: Fiction, Science, Biography, etc.

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend

- **React** - UI library
- **React Context** - State management
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **CSS3** - Styling with modern design

## 📁 Project Structure

```
elibrary-book-management/
├── backend/
│   ├── config.env          # Environment variables
│   ├── package.json        # Backend dependencies
│   ├── server.js          # Main server file
│   ├── models/
│   │   └── User.js        # User model
│   ├── routes/
│   │   └── auth.js        # Authentication routes
│   ├── middleware/
│   │   └── auth.js        # Authentication middleware
│   └── README.md          # Backend documentation
├── frontend/
│   ├── public/
│   │   └── index.html     # Main HTML file
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js   # Login component
│   │   │   ├── Signup.js  # Signup component
│   │   │   └── Dashboard.js # Dashboard component
│   │   ├── contexts/
│   │   │   └── AuthContext.js # Auth context
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Frontend dependencies
│   └── README.md          # Frontend documentation
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Update `config.env` with your MongoDB URI and JWT secret

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/elibrary
   JWT_SECRET=your_secure_jwt_secret
   NODE_ENV=development
   ```

4. **Start MongoDB:**

   - Ensure MongoDB is running locally or use MongoDB Atlas

5. **Start the server:**
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## 🔐 Authentication

### User Roles

- **User**: Basic library access
- **Staff**: Book management capabilities
- **Admin**: Full system administration

### API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

## 🎨 UI/UX Features

- **Modern Design**: Clean, responsive interface with gradient themes
- **Form Validation**: Real-time client-side validation
- **Toast Notifications**: User-friendly success/error messages
- **Loading States**: Visual feedback during API calls
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: CSS transitions and keyframes

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation with express-validator
- **CORS Protection**: Cross-origin resource sharing
- **Role-Based Access**: Different permissions per user role
- **Account Status**: Active/inactive account management

## 📱 Screenshots

### Login Page

- Clean authentication form with email/password
- Form validation with real-time feedback
- Link to registration page

### Registration Page

- Comprehensive signup form
- Role selection dropdown
- Password confirmation
- Optional phone number field

### Dashboard

- Welcome screen for authenticated users
- User information display
- Role-based feature overview
- Logout functionality

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Use strong JWT secret
3. Configure production MongoDB URI
4. Deploy to Heroku, AWS, or DigitalOcean

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy `build` folder to Netlify, Vercel, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the backend and frontend README files
- Review the API documentation
- Check the troubleshooting sections

## 🔮 Future Enhancements

- Book management system
- Search and filtering capabilities
- Issue and return functionality
- Due date tracking and fines
- User borrowing history
- Book reservations
- Advanced reporting and analytics
- Email notifications
- Mobile app development

---

**Built with ❤️ using the MERN stack**
