# 🎬 Cinema Frontend - React + TypeScript

A modern, responsive web application built with React and TypeScript for browsing movies, selecting seats, and booking cinema tickets with real-time error handling and JWT authentication.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Available Scripts](#available-scripts)
- [Features](#features)
- [Component Architecture](#component-architecture)
- [API Integration](#api-integration)
- [Responsive Design](#responsive-design)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Cinema Frontend is a user-friendly web application that provides:
- User authentication (login/registration)
- Browse movies and showtimes
- Interactive seat selection
- Ticket booking system
- Booking history management
- Admin panel for content management
- Real-time error handling with user-friendly messages

**Key Features:**
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ JWT-based authentication
- ✅ Real-time error messages
- ✅ Loading states and spinners
- ✅ Form validation
- ✅ Role-based UI (Admin/User)
- ✅ TypeScript for type safety

---

## 🛠️ Tech Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| React | 19.1.1 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.1.7 | Build tool |
| React Router | 7.0.0 | Client-side routing |
| Axios | 1.7.0 | HTTP client |
| CSS3 | Latest | Styling |
| Node.js | 18+ | Runtime |
| npm | 9+ | Package manager |

---

## 📁 Project Structure

```
cinema_frontend/
├── README.md                          # This file
├── package.json                       # NPM dependencies
├── vite.config.ts                     # Vite configuration
├── tsconfig.json                      # TypeScript configuration
├── index.html                         # HTML entry point
├── public/                            # Static assets
│   └── vite.svg
├── src/
│   ├── main.tsx                       # React entry point
│   ├── App.tsx                        # Main app component
│   ├── App.css                        # Main styles
│   ├── index.css                      # Global styles
│   ├── pages/
│   │   ├── Login.tsx                  # Login page
│   │   ├── Register.tsx               # Registration page
│   │   ├── MovieList.tsx              # Browse movies
│   │   ├── BookingForm.tsx            # Seat selection & booking
│   │   ├── UserBookings.tsx           # View bookings
│   │   ├── AddMovie.tsx               # Admin: Add movie
│   │   ├── AddHall.tsx                # Admin: Add hall
│   │   ├── AddShowtime.tsx            # Admin: Add showtime
│   │   ├── HallList.tsx               # View halls
│   │   ├── ShowtimeList.tsx           # View showtimes
│   │   └── ShowtimesByMovie.tsx       # Showtimes by movie
│   ├── components/
│   │   ├── ErrorMessage.tsx           # Error display
│   │   ├── SuccessMessage.tsx         # Success display
│   │   ├── LoadingSpinner.tsx         # Loading indicator
│   │   └── Navigation.tsx             # Navigation bar
│   ├── context/
│   │   └── AuthContext.tsx            # Authentication state
│   ├── services/
│   │   └── api.ts                     # API client
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   └── styles/
│       ├── Auth.css                   # Auth pages styles
│       ├── Form.css                   # Form styles
│       ├── MovieList.css              # Movie list styles
│       ├── ErrorMessage.css           # Error styles
│       ├── Responsive.css             # Responsive utilities
│       └── ...
├── Dockerfile                         # Docker configuration
└── node_modules/                      # Dependencies
```

---

## 📦 Prerequisites

- **Node.js 18+**
- **npm 9+** or **yarn**
- **Git** (optional)

### Verify Installation

```bash
node --version
npm --version
```

---

## 🚀 Setup & Installation

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd cinema_frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure API Endpoint

Update `src/services/api.ts` if backend is on different URL:
```typescript
const API_BASE_URL = 'http://localhost:8080';
```

### Step 4: Start Development Server
```bash
npm run dev
```

Application runs on: **http://localhost:5173**

---

## 📜 Available Scripts

### Development
```bash
# Start development server
npm run dev

# Start on specific port
npm run dev -- --port 3000
```

### Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting
```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix
```

---

## ✨ Features

### User Features
- ✅ User Registration
- ✅ User Login with JWT
- ✅ Browse Movies
- ✅ View Showtimes
- ✅ Select Seats
- ✅ Book Tickets
- ✅ View Booking History
- ✅ Logout

### Admin Features
- ✅ Add Movies
- ✅ Add Cinema Halls
- ✅ Schedule Showtimes
- ✅ View All Bookings

### UI/UX Features
- ✅ Responsive Design
- ✅ Real-time Error Messages
- ✅ Loading Spinners
- ✅ Form Validation
- ✅ Success Messages
- ✅ Navigation Bar
- ✅ Mobile-friendly

---

## 🏗️ Component Architecture

### Pages

| Component | Purpose | Auth Required |
|-----------|---------|----------------|
| Login.tsx | User login | ❌ No |
| Register.tsx | User registration | ❌ No |
| MovieList.tsx | Browse movies | ❌ No |
| BookingForm.tsx | Select seats & book | ✅ Yes |
| UserBookings.tsx | View bookings | ✅ Yes |
| AddMovie.tsx | Add movie (Admin) | ✅ Admin |
| AddHall.tsx | Add hall (Admin) | ✅ Admin |
| AddShowtime.tsx | Add showtime (Admin) | ✅ Admin |
| HallList.tsx | View halls | ❌ No |
| ShowtimeList.tsx | View showtimes | ❌ No |
| ShowtimesByMovie.tsx | Showtimes by movie | ❌ No |

### Components

| Component | Purpose |
|-----------|---------|
| ErrorMessage.tsx | Display error messages |
| SuccessMessage.tsx | Display success messages |
| LoadingSpinner.tsx | Show loading state |
| Navigation.tsx | Navigation bar |

### Context

| Context | Purpose |
|---------|---------|
| AuthContext.tsx | Global authentication state |

---

## 🔌 API Integration

### API Service (api.ts)

```typescript
// Authentication
authService.login(email, password)
authService.register(userData)

// Movies
movieService.getAllMovies()
movieService.addMovie(movieData)
movieService.deleteMovie(id)

// Halls
hallService.getAllHalls()
hallService.addHall(hallData)

// Showtimes
showtimeService.getUpcomingShowtimes()
showtimeService.getShowtimesByMovie(movieId)
showtimeService.addShowtime(showtimeData)

// Bookings
bookingService.bookTicket(bookingData)
bookingService.getUserBookings(userId)

// Seats
seatService.getAvailableSeats(showtimeId)
```

### Error Handling

All API calls include comprehensive error handling:
- HTTP status code handling (401, 403, 404, 500)
- Network error handling
- User-friendly error messages
- Automatic redirect on 401 (Unauthorized)

---

## 📱 Responsive Design

### Breakpoints

| Device | Width | Columns | Layout |
|--------|-------|---------|--------|
| Small Mobile | 320px - 480px | 1 | Stacked |
| Mobile | 481px - 768px | 1-2 | Flexible |
| Tablet | 769px - 1024px | 2-3 | Grid |
| Desktop | 1025px+ | 3-4+ | Full |

### Responsive Features
- ✅ Mobile-first design
- ✅ Flexible layouts
- ✅ Touch-friendly buttons
- ✅ Readable fonts
- ✅ Optimized images
- ✅ Responsive navigation

---

## 🔐 Authentication Flow

### Login Process
1. User enters email and password
2. Frontend sends credentials to backend
3. Backend validates and returns JWT token
4. Frontend decodes JWT to extract userId
5. Frontend stores token and user info in localStorage
6. User is redirected to home page

### JWT Token Storage
```javascript
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify(userInfo));
```

### Token Usage
```javascript
// Automatically added to all requests
Authorization: Bearer <jwt_token>
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can register
- [ ] User can login
- [ ] User can browse movies
- [ ] User can view showtimes
- [ ] User can select seats
- [ ] User can book tickets
- [ ] User can view bookings
- [ ] Admin can add movies
- [ ] Admin can add halls
- [ ] Admin can add showtimes
- [ ] Error messages display correctly
- [ ] Responsive design works on mobile

---

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
npm run dev -- --port 3000
```

### Module Not Found Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Ensure backend is running on http://localhost:8080
- Check backend CORS configuration
- Clear browser cache

### 403 Forbidden Errors
- Verify JWT token is valid
- Check user role for admin endpoints
- Login again to refresh token

### Blank Page
- Check browser console for errors
- Verify backend is running
- Check network tab for failed requests

### localStorage Issues
- Clear browser cache and cookies
- Check DevTools → Application → localStorage
- Verify token is being stored

---

## 📚 TypeScript Types

### User Type
```typescript
interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'USER';
}
```

### Movie Type
```typescript
interface Movie {
  id?: number;
  title: string;
  genre: string;
  durationMinutes: number;
  releaseDate: string;
}
```

### Booking Type
```typescript
interface Booking {
  id?: number;
  user?: User;
  showtime?: Showtime;
  seatNumber: string;
  bookingTime?: string;
  price: number;
}
```

---

## 🎨 Styling

### CSS Organization
- **App.css** - Main application styles
- **index.css** - Global styles
- **Auth.css** - Authentication pages
- **Form.css** - Form components
- **MovieList.css** - Movie listing
- **ErrorMessage.css** - Error display
- **Responsive.css** - Responsive utilities

### CSS Variables
```css
:root {
  --primary-color: #007bff;
  --danger-color: #dc3545;
  --success-color: #28a745;
  --warning-color: #ffc107;
}
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

---

## 🎉 Ready to Start?

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open http://localhost:5173
4. Register or login
5. Start booking tickets!

**Happy Booking! 🎬🍿**

