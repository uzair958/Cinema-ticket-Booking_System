import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type {
  User,
  Movie,
  Hall,
  Seat,
  Showtime,
  Booking,
  AddMovieRequest,
  AddHallRequest,
  AddShowtimeRequest,
  BookSeatRequest,
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ ERROR HANDLING UTILITIES ============

/**
 * Extract meaningful error message from various error sources
 */
export const getErrorMessage = (error: unknown): string => {
  // Handle axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    // Handle 401 Unauthorized
    if (axiosError.response?.status === 401) {
      return 'Session expired. Please login again.';
    }

    // Handle 403 Forbidden
    if (axiosError.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }

    // Handle 404 Not Found
    if (axiosError.response?.status === 404) {
      return 'The requested resource was not found.';
    }

    // Handle 400 Bad Request
    if (axiosError.response?.status === 400) {
      const data = axiosError.response.data;
      if (typeof data === 'object' && data !== null) {
        if ('error' in data) return data.error;
        if ('message' in data) return data.message;
      }
      return 'Invalid request. Please check your input.';
    }

    // Handle 500 Server Error
    if (axiosError.response?.status === 500) {
      return 'Server error. Please try again later.';
    }

    // Handle network errors
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your connection.';
    }

    if (axiosError.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection.';
    }

    // Handle response data with error message
    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      if (typeof data === 'object' && data !== null) {
        if ('error' in data) return data.error;
        if ('message' in data) return data.message;
      }
    }

    // Fallback to status text
    return axiosError.response?.statusText || axiosError.message || 'An error occurred';
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback
  return 'An unexpected error occurred';
};

// ============ REQUEST INTERCEPTOR ============

// Add JWT token to requests (except for auth endpoints)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  // Don't add token for auth endpoints (login, register)
  if (token && !config.url?.includes('/auth/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ RESPONSE INTERCEPTOR ============

// Handle responses and errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Re-throw error with meaningful message
    const errorMessage = getErrorMessage(error);
    const enhancedError = new Error(errorMessage);
    return Promise.reject(enhancedError);
  }
);

// ============ AUTH ENDPOINTS ============

export const authService = {
  login: async (email: string, password: string): Promise<string> => {
    const response = await apiClient.post<string>(
      '/auth/login',
      {},
      { params: { email, password } }
    );
    return response.data;
  },

  register: async (user: User): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', user);
    return response.data;
  },
};

// ============ MOVIE ENDPOINTS ============

export const movieService = {
  getAllMovies: async (): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies/public/all');
    return response.data;
  },

  searchMovies: async (title: string): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies/public/search', {
      params: { title },
    });
    return response.data;
  },

  addMovie: async (movie: AddMovieRequest): Promise<Movie> => {
    const response = await apiClient.post<Movie>('/movies/add', movie);
    return response.data;
  },

  deleteMovie: async (id: number): Promise<string> => {
    const response = await apiClient.delete<string>(`/movies/${id}`);
    return response.data;
  },
};

// ============ HALL ENDPOINTS ============

export const hallService = {
  getAllHalls: async (): Promise<Hall[]> => {
    const response = await apiClient.get<Hall[]>('/halls/all');
    return response.data;
  },

  addHall: async (hall: AddHallRequest): Promise<Hall> => {
    const response = await apiClient.post<Hall>('/halls/add', hall);
    return response.data;
  },

  getSeatsForHall: async (hallId: number): Promise<Seat[]> => {
    const response = await apiClient.get<Seat[]>(`/halls/${hallId}/seats`);
    return response.data;
  },
};

// ============ SEAT ENDPOINTS ============

export const seatService = {
  getAvailableSeats: async (hallId: number): Promise<Seat[]> => {
    const response = await apiClient.get<Seat[]>(`/seats/available/${hallId}`);
    return response.data;
  },

  updateSeatAvailability: async (seatId: number, available: boolean): Promise<Seat> => {
    const response = await apiClient.put<Seat>(
      `/seats/${seatId}/availability`,
      {},
      { params: { available } }
    );
    return response.data;
  },
};

// ============ SHOWTIME ENDPOINTS ============

export const showtimeService = {
  getUpcomingShowtimes: async (): Promise<Showtime[]> => {
    const response = await apiClient.get<Showtime[]>('/showtimes/upcoming');
    return response.data;
  },

  getShowtimesByMovie: async (movieId: number): Promise<Showtime[]> => {
    const response = await apiClient.get<Showtime[]>(`/showtimes/movie/${movieId}`);
    return response.data;
  },

  addShowtime: async (showtime: AddShowtimeRequest): Promise<Showtime> => {
    const response = await apiClient.post<Showtime>('/showtimes/add', showtime);
    return response.data;
  },
};

// ============ BOOKING ENDPOINTS ============

export const bookingService = {
  bookSeat: async (booking: BookSeatRequest): Promise<Booking> => {
    const response = await apiClient.post<Booking>(
      '/bookings/book',
      {},
      {
        params: {
          userId: booking.userId,
          showtimeId: booking.showtimeId,
          seatNumber: booking.seatNumber,
          price: booking.price,
        },
      }
    );
    return response.data;
  },

  getUserBookings: async (userId: number): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>(`/bookings/user/${userId}`);
    return response.data;
  },
};

export default apiClient;

