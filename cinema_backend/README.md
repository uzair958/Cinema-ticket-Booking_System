# 🎬 Cinema Backend - Spring Boot API

A robust REST API built with Spring Boot for managing cinema operations including movies, halls, showtimes, and bookings with JWT authentication and role-based access control.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Running Tests](#running-tests)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Cinema Backend provides a comprehensive REST API for:
- User authentication and registration
- Movie management
- Cinema hall management
- Showtime scheduling
- Ticket booking system
- Seat availability management

**Key Features:**
- ✅ JWT-based authentication
- ✅ Role-based access control (ADMIN, USER)
- ✅ CORS support for frontend integration
- ✅ Comprehensive error handling
- ✅ Database persistence with JPA/Hibernate
- ✅ RESTful API design

---

## 🛠️ Tech Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| Java | 20 | Programming language |
| Spring Boot | 3.5.6 | Framework |
| Spring Security | Latest | Authentication & Authorization |
| Spring Data JPA | Latest | Database access |
| MySQL | 8.0+ | Database |
| JWT (Auth0) | Latest | Token generation |
| Maven | 3.6+ | Build tool |
| Lombok | Latest | Code generation |

---

## 📁 Project Structure

```
cinema_backend/
├── README.md                          # This file
├── pom.xml                            # Maven dependencies
├── Dockerfile                         # Docker configuration
├── src/
│   ├── main/
│   │   ├── java/com/example/cinema_backend/
│   │   │   ├── CinemaBackendApplication.java    # Main entry point
│   │   │   ├── configs/
│   │   │   │   ├── SecurityConfig.java          # JWT & CORS config
│   │   │   │   ├── JwtUtil.java                 # JWT utilities
│   │   │   │   └── JwtAuthFilter.java           # JWT filter
│   │   │   ├── controllers/
│   │   │   │   ├── AuthController.java          # Auth endpoints
│   │   │   │   ├── MovieController.java         # Movie endpoints
│   │   │   │   ├── HallController.java          # Hall endpoints
│   │   │   │   ├── ShowtimeController.java      # Showtime endpoints
│   │   │   │   ├── BookingController.java       # Booking endpoints
│   │   │   │   └── SeatController.java          # Seat endpoints
│   │   │   ├── services/
│   │   │   │   ├── AuthService.java             # Auth logic
│   │   │   │   ├── MovieService.java            # Movie logic
│   │   │   │   ├── HallService.java             # Hall logic
│   │   │   │   ├── ShowtimeService.java         # Showtime logic
│   │   │   │   ├── BookingService.java          # Booking logic
│   │   │   │   └── SeatService.java             # Seat logic
│   │   │   ├── repositories/
│   │   │   │   ├── UserRepository.java          # User DB access
│   │   │   │   ├── MovieRepository.java         # Movie DB access
│   │   │   │   ├── HallRepository.java          # Hall DB access
│   │   │   │   ├── ShowtimeRepository.java      # Showtime DB access
│   │   │   │   ├── BookingRepository.java       # Booking DB access
│   │   │   │   └── SeatRepository.java          # Seat DB access
│   │   │   └── entities/
│   │   │       ├── User.java                    # User entity
│   │   │       ├── Movie.java                   # Movie entity
│   │   │       ├── Hall.java                    # Hall entity
│   │   │       ├── Showtime.java                # Showtime entity
│   │   │       ├── Booking.java                 # Booking entity
│   │   │       └── Seat.java                    # Seat entity
│   │   └── resources/
│   │       └── application.properties           # Configuration
│   └── test/                          # Unit tests
└── target/                            # Build output
```

---

## 📦 Prerequisites

- **Java 20** or higher
- **Maven 3.6+**
- **MySQL 8.0+**
- **Git** (optional)

### Verify Installation

```bash
java -version
mvn -version
mysql --version
```

---

## 🚀 Setup & Installation

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd cinema_backend
```

### Step 2: Configure Database

Create MySQL database:
```sql
CREATE DATABASE cinema_db;
```

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cinema_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### Step 3: Build Project
```bash
mvn clean install
```

### Step 4: Run Application
```bash
mvn spring-boot:run
```

Server starts on: **http://localhost:8080**

---

## ⚙️ Configuration

### application.properties

```properties
# Server
server.port=8080
server.servlet.context-path=/

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/cinema_db
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT
jwt.secret=super_secret_key_123
jwt.expiration=3600000

# Logging
logging.level.root=INFO
logging.level.com.example.cinema_backend=DEBUG
```

---

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/register` | User registration | ❌ |

### Movie Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/movies/public/all` | Get all movies | ❌ |
| POST | `/api/movies/add` | Add new movie | ✅ Admin |
| DELETE | `/api/movies/{id}` | Delete movie | ✅ Admin |

### Hall Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/halls/all` | Get all halls | ❌ |
| GET | `/api/halls/{id}/seats` | Get hall seats | ❌ |
| POST | `/api/halls/add` | Add new hall | ✅ Admin |

### Showtime Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/showtimes/upcoming` | Get upcoming showtimes | ❌ |
| GET | `/api/showtimes/movie/{movieId}` | Get showtimes by movie | ❌ |
| POST | `/api/showtimes/add` | Add new showtime | ✅ Admin |

### Booking Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/bookings/book` | Book ticket | ✅ User |
| GET | `/api/bookings/user/{userId}` | Get user bookings | ✅ User |

### Seat Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/seats/available/{showtimeId}` | Get available seats | ❌ |
| PUT | `/api/seats/{id}/availability` | Update seat availability | ✅ User |

---

## 🔐 Authentication

### JWT Token

**Structure:**
```json
{
  "sub": "user@example.com",
  "userId": 1,
  "role": "USER",
  "iat": 1234567890,
  "exp": 1234571490
}
```

**Token Expiration:** 1 hour

### Authorization

- **Public Endpoints:** GET requests (no token required)
- **Authenticated:** POST/PUT/DELETE, user bookings
- **Admin Only:** Add/delete movies, halls, showtimes

### Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role ENUM('ADMIN', 'USER') DEFAULT 'USER'
);
```

### Movies Table
```sql
CREATE TABLE movies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  duration_minutes INT,
  release_date DATE
);
```

### Halls Table
```sql
CREATE TABLE halls (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  total_seats INT NOT NULL
);
```

### Seats Table
```sql
CREATE TABLE seats (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  seat_number VARCHAR(10) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  hall_id BIGINT,
  FOREIGN KEY (hall_id) REFERENCES halls(id)
);
```

### Showtimes Table
```sql
CREATE TABLE showtimes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  start_time DATETIME NOT NULL,
  movie_id BIGINT,
  hall_id BIGINT,
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (hall_id) REFERENCES halls(id)
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  showtime_id BIGINT,
  seat_number VARCHAR(10) NOT NULL,
  booking_time DATETIME,
  price DOUBLE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id)
);
```

---

## 🧪 Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthControllerTest

# Run with coverage
mvn test jacoco:report
```

---

## 🐛 Troubleshooting

### Port 8080 Already in Use
```bash
# Find process
netstat -ano | findstr :8080

# Kill process
taskkill /PID <PID> /F
```

### Database Connection Error
- Verify MySQL is running
- Check credentials in application.properties
- Ensure database exists

### JWT Token Errors
- Token may be expired (1 hour expiration)
- Verify token format in Authorization header
- Check token signature

### CORS Errors
- Ensure frontend URL is in CORS configuration
- Check SecurityConfig.java

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT Documentation](https://jwt.io)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## 🎉 Ready to Start?

1. Configure database
2. Run `mvn clean install`
3. Run `mvn spring-boot:run`
4. API available at http://localhost:8080

**Happy Coding! 🚀**
