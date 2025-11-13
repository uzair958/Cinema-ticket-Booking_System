import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import MovieList from './pages/MovieList';
import AddMovie from './pages/AddMovie';
import EditMovie from './pages/EditMovie';
import HallList from './pages/HallList';
import AddHall from './pages/AddHall';
import EditHall from './pages/EditHall';
import ShowtimeList from './pages/ShowtimeList';
import ShowtimesByMovie from './pages/ShowtimesByMovie';
import AddShowtime from './pages/AddShowtime';
import EditShowtime from './pages/EditShowtime';
import BookingForm from './pages/BookingForm';
import UserBookings from './pages/UserBookings';
import UserManagement from './pages/UserManagement';

import './App.css';

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎬 Cinema Booking
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/movies" className="nav-link">
              Movies
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/showtimes" className="nav-link">
              Showtimes
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/halls" className="nav-link">
              Halls
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li className="nav-item">
                <Link to="/my-bookings" className="nav-link">
                  {user?.role === 'ADMIN' ? 'All Bookings' : 'My Bookings'}
                </Link>
              </li>
              {user?.role === 'ADMIN' && (
                <>
                  <li className="nav-item">
                    <Link to="/add-movie" className="nav-link">
                      Add Movie
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/add-hall" className="nav-link">
                      Add Hall
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/add-showtime" className="nav-link">
                      Add Showtime
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/users" className="nav-link">
                      👥 Users
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <span className="user-info">{user?.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <main className="main-content">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Movie Routes */}
          <Route path="/" element={<MovieList />} />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/add-movie" element={<AddMovie />} />
          <Route path="/edit-movie/:movieId" element={<EditMovie />} />

          {/* Hall Routes */}
          <Route path="/halls" element={<HallList />} />
          <Route path="/add-hall" element={<AddHall />} />
          <Route path="/edit-hall/:hallId" element={<EditHall />} />

          {/* Showtime Routes */}
          <Route path="/showtimes" element={<ShowtimeList />} />
          <Route path="/showtimes/:movieId" element={<ShowtimesByMovie />} />
          <Route path="/add-showtime" element={<AddShowtime />} />
          <Route path="/edit-showtime/:showtimeId" element={<EditShowtime />} />

          {/* Booking Routes */}
          <Route path="/booking/:showtimeId" element={<BookingForm />} />
          <Route path="/my-bookings" element={<UserBookings />} />

          {/* Admin Routes */}
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
