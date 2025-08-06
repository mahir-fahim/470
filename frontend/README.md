# E-Library Book Management System - Frontend

A modern React frontend for the E-Library Book Management System with secure authentication and beautiful UI design.

## Features

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Secure Authentication**: JWT-based authentication with context management
- **Role-Based Interface**: Different views for users, staff, and admins
- **Form Validation**: Client-side validation with real-time feedback
- **Toast Notifications**: User-friendly success/error messages
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README)

## Installation

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

The application will open in your browser at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── components/
│   │   ├── Login.js        # Login form component
│   │   ├── Signup.js       # Registration form component
│   │   └── Dashboard.js    # Main dashboard component
│   ├── contexts/
│   │   └── AuthContext.js  # Authentication context
│   ├── App.js              # Main app component
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Components

### Login Component

- Email and password authentication
- Form validation with real-time feedback
- Loading states during authentication
- Error handling and user-friendly messages
- Link to signup page

### Signup Component

- Complete user registration form
- Role selection (User, Staff, Admin)
- Comprehensive form validation
- Password confirmation
- Optional phone number field

### Dashboard Component

- Welcome screen for authenticated users
- User information display
- Role-based feature overview
- Logout functionality
- Responsive design

### AuthContext

- Global authentication state management
- JWT token handling
- User profile management
- Automatic token validation
- Logout functionality

## Features Overview

### Authentication Flow

1. **Login**: Users can sign in with email and password
2. **Registration**: New users can create accounts with role selection
3. **Token Management**: Automatic JWT token storage and validation
4. **Logout**: Secure logout with token removal

### User Roles

- **User**: Basic library access
- **Staff**: Book management capabilities
- **Admin**: Full system administration

### UI/UX Features

- **Modern Design**: Gradient backgrounds and card-based layout
- **Responsive**: Works on all device sizes
- **Animations**: Smooth transitions and loading states
- **Form Validation**: Real-time input validation
- **Toast Notifications**: Success/error feedback
- **Loading States**: Visual feedback during API calls

## Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## API Integration

The frontend communicates with the backend API at `http://localhost:5000`:

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Request/Response Format

All API calls use JSON format with proper error handling and loading states.

## Styling

The application uses custom CSS with:

- **Modern Color Scheme**: Purple gradient theme
- **Card-Based Design**: Clean, organized layout
- **Responsive Grid**: Flexible layouts for different screen sizes
- **Smooth Animations**: CSS transitions and keyframes
- **Form Styling**: Consistent input and button styles

## State Management

Uses React Context API for:

- **Authentication State**: User login/logout status
- **User Data**: Current user information
- **Token Management**: JWT token storage and validation
- **Loading States**: API call status management

## Error Handling

- **Form Validation**: Client-side validation with real-time feedback
- **API Error Handling**: Proper error messages from backend
- **Network Errors**: Graceful handling of connection issues
- **User Feedback**: Toast notifications for all user actions

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add routes in `App.js` if needed
3. Update authentication context if required
4. Add styles to `index.css`

### Code Style

- Use functional components with hooks
- Implement proper error handling
- Add loading states for API calls
- Use consistent naming conventions

## Production Build

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting service:
   - Netlify
   - Vercel
   - AWS S3
   - GitHub Pages

## Environment Variables

Create a `.env` file in the frontend directory if needed:

```
REACT_APP_API_URL=http://localhost:5000
```

## Troubleshooting

### Common Issues

1. **Backend Connection**: Ensure backend server is running on port 5000
2. **CORS Errors**: Backend should have CORS configured
3. **Token Issues**: Clear localStorage if authentication problems occur
4. **Build Errors**: Check for missing dependencies

### Development Tips

- Use browser developer tools for debugging
- Check network tab for API call issues
- Use React Developer Tools for component debugging
- Monitor console for error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
