# 🎬 ESD Cinema Ticket Booking System

A full-stack web application for booking cinema tickets with user authentication, seat selection, and admin management features.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

The ESD Cinema Ticket Booking System is a modern web application that allows users to:
- Browse available movies and showtimes
- Select seats and book tickets
- View their booking history
- Manage their profile

Administrators can:
- Add/manage movies
- Create cinema halls
- Schedule showtimes
- View all bookings

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.5.6
- **Language:** Java 20
- **Database:** MySQL (via JPA/Hibernate)
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Spring Security with role-based access control
- **Build Tool:** Maven

### Frontend
- **Framework:** React 19.1.1
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 7.1.7
- **Routing:** React Router DOM 7.0.0
- **HTTP Client:** Axios 1.7.0
- **Styling:** CSS3 with responsive design

---

## 📁 Project Structure

```
ESD CINEMA TICKET BOOKING SYSTEM/
├── README.md                    # This file
├── docker-compose.yml           # Docker compose configuration
├── cinema_backend/              # Spring Boot Backend
│   ├── README.md               # Backend documentation
│   ├── pom.xml                 # Maven dependencies
│   └── src/                    # Source code
└── cinema_frontend/            # React + TypeScript Frontend
    ├── README.md               # Frontend documentation
    ├── package.json            # NPM dependencies
    └── src/                    # Source code
```

---

## 📦 Prerequisites

### Backend Requirements
- Java 20 or higher
- Maven 3.6+
- MySQL 8.0+

### Frontend Requirements
- Node.js 18+
- npm 9+

### Optional
- Docker and Docker Compose

---

## 🚀 Quick Start

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd "ESD CINEMA TICKET BOOKING SYSTEM"
```

### Step 2: Start Backend
```bash
cd cinema_backend
mvn clean install
mvn spring-boot:run
```
Backend runs on: **http://localhost:8080**

### Step 3: Start Frontend
```bash
cd cinema_frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

### Step 4: Access Application
Open browser: **http://localhost:5173**

---

## ✨ Features

### User Features
- ✅ User Registration and Login
- ✅ Browse Movies and Showtimes
- ✅ View Available Seats
- ✅ Book Tickets
- ✅ View Booking History
- ✅ Responsive Design
- ✅ Real-time Error Handling

### Admin Features
- ✅ Add/Edit/Delete Movies
- ✅ Create Cinema Halls
- ✅ Schedule Showtimes
- ✅ View All Bookings

### Security Features
- ✅ JWT Authentication
- ✅ Role-Based Access Control
- ✅ Password Hashing (BCrypt)
- ✅ CORS Protection
- ✅ Secure Session Management

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Movies
- `GET /api/movies/public/all` - Get all movies
- `POST /api/movies/add` - Add movie (Admin)
- `DELETE /api/movies/{id}` - Delete movie (Admin)

### Halls
- `GET /api/halls/all` - Get all halls
- `GET /api/halls/{id}/seats` - Get hall seats
- `POST /api/halls/add` - Add hall (Admin)

### Showtimes
- `GET /api/showtimes/upcoming` - Get upcoming showtimes
- `GET /api/showtimes/movie/{movieId}` - Get showtimes by movie
- `POST /api/showtimes/add` - Add showtime (Admin)

### Bookings
- `POST /api/bookings/book` - Book ticket (Authenticated)
- `GET /api/bookings/user/{userId}` - Get user bookings (Authenticated)

### Seats
- `GET /api/seats/available/{showtimeId}` - Get available seats
- `PUT /api/seats/{id}/availability` - Update seat availability

---

## 🔐 Authentication

### JWT Token Structure
```json
{
  "sub": "user@example.com",
  "userId": 1,
  "role": "USER",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Authorization Levels
- **Public:** GET requests (movies, halls, showtimes, seats)
- **Authenticated:** POST/PUT/DELETE, user bookings
- **Admin:** Add/delete movies, halls, showtimes

---

## 📱 Responsive Design

| Device | Width | Columns |
|--------|-------|---------|
| Small Mobile | 320px - 480px | 1 |
| Mobile | 481px - 768px | 1-2 |
| Tablet | 769px - 1024px | 2-3 |
| Desktop | 1025px+ | 3-4+ |

---

## 🐛 Troubleshooting

### Backend Issues
- **Port 8080 in use:** Kill process or use different port
- **Database error:** Ensure MySQL is running
- **JWT errors:** Clear localStorage and login again

### Frontend Issues
- **Port 5173 in use:** `npm run dev -- --port 3000`
- **Module not found:** `npm install`
- **CORS errors:** Ensure backend is running
- **403 errors:** Check JWT token validity

---

## 📚 Documentation

- **Backend:** See [cinema_backend/README.md](cinema_backend/README.md)
- **Frontend:** See [cinema_frontend/README.md](cinema_frontend/README.md)

---

## 🎉 Ready to Start?

Follow the [Quick Start](#quick-start) guide above!

**Happy Booking! 🎬🍿**
