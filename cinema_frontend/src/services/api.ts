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
    try {
      const response = await apiClient.get<Movie[]>('/movies/public/all');
      console.log('✅ getAllMovies response:', response.data);

      // Ensure response is an array
      if (!Array.isArray(response.data)) {
        console.error('❌ getAllMovies returned non-array:', response.data);
        return [];
      }

      // Filter out any invalid entries
      const validMovies = response.data.filter((movie: any) => movie && movie.id && movie.title);
      console.log('✅ Valid movies count:', validMovies.length);

      return validMovies;
    } catch (error) {
      console.error('❌ getAllMovies error:', error);
      throw error;
    }
  },

  searchMovies: async (title: string): Promise<Movie[]> => {
    try {
      const response = await apiClient.get<Movie[]>('/movies/public/search', {
        params: { title },
      });
      console.log('✅ searchMovies response:', response.data);

      // Ensure response is an array
      if (!Array.isArray(response.data)) {
        console.error('❌ searchMovies returned non-array:', response.data);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('❌ searchMovies error:', error);
      throw error;
    }
  },

  getMovieById: async (movieId: number): Promise<Movie> => {
    try {
      console.log('🔄 Fetching movie:', movieId);
      const response = await apiClient.get<Movie>(`/movies/${movieId}`);
      console.log('✅ getMovieById response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getMovieById error:', error);
      throw error;
    }
  },

  addMovie: async (movie: AddMovieRequest): Promise<Movie> => {
    try {
      const response = await apiClient.post<Movie>('/movies/add', movie);
      console.log('✅ addMovie response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ addMovie error:', error);
      throw error;
    }
  },

  updateMovie: async (movieId: number, movie: AddMovieRequest): Promise<Movie> => {
    try {
      console.log('📤 Updating movie:', movieId, movie);
      const response = await apiClient.put<Movie>(`/movies/${movieId}`, movie);
      console.log('✅ updateMovie response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ updateMovie error:', error);
      throw error;
    }
  },

  deleteMovie: async (id: number): Promise<string> => {
    try {
      const response = await apiClient.delete<string>(`/movies/${id}`);
      console.log('✅ deleteMovie response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ deleteMovie error:', error);
      throw error;
    }
  },
};

// ============ HALL ENDPOINTS ============

export const hallService = {
  getAllHalls: async (): Promise<Hall[]> => {
    try {
      const response = await apiClient.get<Hall[]>('/halls/all');
      console.log('✅ getAllHalls response:', response.data);

      // Ensure response is an array
      if (!Array.isArray(response.data)) {
        console.error('❌ getAllHalls returned non-array:', response.data);
        console.error('Response type:', typeof response.data);
        console.error('Response keys:', Object.keys(response.data || {}));
        return [];
      }

      // Filter out any invalid entries
      const validHalls = response.data.filter((hall: any) => hall && hall.id && hall.name);
      console.log('✅ Valid halls count:', validHalls.length);

      return validHalls;
    } catch (error) {
      console.error('❌ getAllHalls error:', error);
      throw error;
    }
  },

  getHallById: async (hallId: number): Promise<Hall> => {
    try {
      const response = await apiClient.get<Hall>(`/halls/${hallId}`);
      console.log('✅ getHallById response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getHallById error:', error);
      throw error;
    }
  },

  addHall: async (hall: AddHallRequest): Promise<Hall> => {
    try {
      console.log('📤 Sending hall data:', hall);

      // Ensure totalSeats is a number
      const hallData = {
        name: hall.name,
        totalSeats: parseInt(String(hall.totalSeats), 10),
      };

      console.log('📤 Converted hall data:', hallData);
      const response = await apiClient.post<Hall>('/halls/add', hallData);
      console.log('✅ addHall response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ addHall error:', error);
      throw error;
    }
  },

  updateHall: async (hallId: number, hall: AddHallRequest): Promise<Hall> => {
    try {
      console.log('📤 Updating hall:', hallId, hall);

      // Ensure totalSeats is a number
      const hallData = {
        name: hall.name,
        totalSeats: parseInt(String(hall.totalSeats), 10),
      };

      const response = await apiClient.put<Hall>(`/halls/${hallId}`, hallData);
      console.log('✅ updateHall response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ updateHall error:', error);
      throw error;
    }
  },

  deleteHall: async (hallId: number): Promise<string> => {
    try {
      console.log('🗑️ Deleting hall:', hallId);
      const response = await apiClient.delete<string>(`/halls/${hallId}`);
      console.log('✅ deleteHall response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ deleteHall error:', error);
      throw error;
    }
  },

  getSeatsForHall: async (hallId: number): Promise<Seat[]> => {
    try {
      const response = await apiClient.get<Seat[]>(`/halls/${hallId}/seats`);
      console.log('✅ getSeatsForHall response:', response.data);

      // Ensure response is an array
      if (!Array.isArray(response.data)) {
        console.error('❌ getSeatsForHall returned non-array:', response.data);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('❌ getSeatsForHall error:', error);
      throw error;
    }
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

  getShowtimeById: async (showtimeId: number): Promise<Showtime> => {
    try {
      console.log('🔄 Fetching showtime:', showtimeId);
      const response = await apiClient.get<Showtime>(`/showtimes/${showtimeId}`);
      console.log('✅ getShowtimeById response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getShowtimeById error:', error);
      throw error;
    }
  },

  addShowtime: async (showtime: AddShowtimeRequest): Promise<Showtime> => {
    // Convert AddShowtimeRequest to Showtime format with nested objects
    const showtimePayload = {
      startTime: showtime.startTime,
      movie: { id: showtime.movieId },
      hall: { id: showtime.hallId },
    };
    const response = await apiClient.post<Showtime>('/showtimes/add', showtimePayload);
    return response.data;
  },

  updateShowtime: async (showtimeId: number, showtime: AddShowtimeRequest): Promise<Showtime> => {
    try {
      console.log('📤 Updating showtime:', showtimeId, showtime);
      const showtimePayload = {
        startTime: showtime.startTime,
        movie: { id: showtime.movieId },
        hall: { id: showtime.hallId },
      };
      const response = await apiClient.put<Showtime>(`/showtimes/${showtimeId}`, showtimePayload);
      console.log('✅ updateShowtime response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ updateShowtime error:', error);
      throw error;
    }
  },

  deleteShowtime: async (showtimeId: number): Promise<string> => {
    try {
      console.log('🗑️ Deleting showtime:', showtimeId);
      const response = await apiClient.delete<string>(`/showtimes/${showtimeId}`);
      console.log('✅ deleteShowtime response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ deleteShowtime error:', error);
      throw error;
    }
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

  getAllBookings: async (): Promise<Booking[]> => {
    try {
      console.log('🔄 Fetching all bookings (Admin)...');
      const response = await apiClient.get<Booking[]>('/bookings/all');
      console.log('✅ getAllBookings response:', response.data);

      // Ensure response is an array
      if (!Array.isArray(response.data)) {
        console.error('❌ getAllBookings returned non-array:', response.data);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('❌ getAllBookings error:', error);
      throw error;
    }
  },

  getBookingById: async (bookingId: number): Promise<Booking> => {
    try {
      console.log('🔄 Fetching booking:', bookingId);
      const response = await apiClient.get<Booking>(`/bookings/${bookingId}`);
      console.log('✅ getBookingById response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getBookingById error:', error);
      throw error;
    }
  },

  deleteBooking: async (bookingId: number): Promise<string> => {
    try {
      console.log('🗑️ Deleting booking:', bookingId);
      const response = await apiClient.delete<string>(`/bookings/${bookingId}`);
      console.log('✅ deleteBooking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ deleteBooking error:', error);
      throw error;
    }
  },

  updateBooking: async (bookingId: number, booking: Partial<Booking>): Promise<Booking> => {
    try {
      console.log('📤 Updating booking:', bookingId, booking);
      const response = await apiClient.put<Booking>(`/bookings/${bookingId}`, booking);
      console.log('✅ updateBooking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ updateBooking error:', error);
      throw error;
    }
  },
};

// ============ USER ENDPOINTS ============

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      console.log('👥 Fetching all users');
      const response = await apiClient.get<User[]>('/users/all');
      console.log('✅ getAllUsers response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getAllUsers error:', error);
      throw error;
    }
  },

  getUserById: async (userId: number): Promise<User> => {
    try {
      console.log('👥 Fetching user:', userId);
      const response = await apiClient.get<User>(`/users/${userId}`);
      console.log('✅ getUserById response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getUserById error:', error);
      throw error;
    }
  },

  getUserByEmail: async (email: string): Promise<User> => {
    try {
      console.log('👥 Fetching user by email:', email);
      const response = await apiClient.get<User>(`/users/email/${email}`);
      console.log('✅ getUserByEmail response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getUserByEmail error:', error);
      throw error;
    }
  },

  updateUserRole: async (userId: number, role: string): Promise<User> => {
    try {
      console.log('👥 Updating user role:', userId, role);
      const response = await apiClient.put<User>(`/users/${userId}/role`, {}, { params: { role } });
      console.log('✅ updateUserRole response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ updateUserRole error:', error);
      throw error;
    }
  },

  deleteUser: async (userId: number): Promise<string> => {
    try {
      console.log('👥 Deleting user:', userId);
      const response = await apiClient.delete<string>(`/users/${userId}`);
      console.log('✅ deleteUser response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ deleteUser error:', error);
      throw error;
    }
  },
};

export default apiClient;

