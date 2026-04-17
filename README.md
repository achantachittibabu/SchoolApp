# MySchoolApp - React Native Expo Application

A simple React Native Expo application for school management with login, registration, success (home), and failure screens.

## Features

- **Login Screen**: User authentication with userId, password, and userType (student/teacher/admin)
- **Register Screen**: New user registration with validation
- **Home Screen (Success)**: Displays user information and available features after successful login
- **Failure Screen**: Error handling screen with troubleshooting tips

## API Endpoints

### Login
- **URL**: `http://localhost:5000/api/user/login`
- **Method**: POST
- **Body**:
```json
{
  "userId": "user123",
  "password": "password123",
  "userType": "student"
}
```

### Register
- **URL**: `http://localhost:5000/api/students/register`
- **Method**: POST
- **Body**:
```json
{
  "username": "testuser112",
  "email": "test21@example.com",
  "phone": "1234567890",
  "password": "Test@123",
  "confirmPassword": "Test@123",
  "userType": "student"
}
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Backend server running on `http://localhost:5000`

## Installation

1. **Clone or download the project**
```bash
cd MySchoolApp
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the Expo development server**
```bash
npx expo start
```

4. **Run on your device**
   - Scan the QR code with Expo Go app (Android/iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser

## Important Notes

### For Physical Devices or Expo Go App

If you're testing on a physical device or using Expo Go app, you need to update the API URLs to use your computer's local IP address instead of `localhost`.

1. **Find your computer's IP address**:
   - Windows: Run `ipconfig` in Command Prompt
   - Mac/Linux: Run `ifconfig` in Terminal
   - Look for IPv4 Address (e.g., `192.168.1.105`)

2. **Update API URLs in the screens**:

In `screens/LoginScreen.js`, change:
```javascript
const response = await axios.post('http://YOUR_IP_ADDRESS:5000/api/user/login', {
```

In `screens/RegisterScreen.js`, change:
```javascript
const response = await axios.post('http://YOUR_IP_ADDRESS:5000/api/students/register', {
```

Replace `YOUR_IP_ADDRESS` with your actual IP (e.g., `192.168.1.105`)

### For Android Emulator

If using Android Emulator, use `http://10.0.2.2:5000` instead of `localhost:5000`

## Project Structure

```
MySchoolApp/
├── App.js                      # Main app component with navigation
├── screens/
│   ├── LoginScreen.js          # Login screen
│   ├── RegisterScreen.js       # Registration screen
│   ├── HomeScreen.js           # Success/Home screen
│   └── FailureScreen.js        # Error screen
├── package.json                # Dependencies
├── app.json                    # Expo configuration
└── README.md                   # This file
```

## User Types

The app supports three user types:
- **Student**
- **Teacher**
- **Admin**

## Backend Server

Make sure your backend server is running on `http://localhost:5000` before testing the app.

The backend should handle:
- POST `/api/user/login` - Login endpoint
- POST `/api/students/register` - Registration endpoint

## Troubleshooting

### Network Error
- Ensure backend server is running
- Check if using correct IP address (not localhost) on physical devices
- Verify both device and computer are on the same WiFi network
- Check firewall settings

### Cannot connect to server
- Make sure backend is running on port 5000
- Test backend URL in browser or Postman first
- Use computer's IP address instead of localhost for physical devices

## Screenshots

(Add screenshots here if needed)

## License

MIT License
