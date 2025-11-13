// User Types
export interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'USER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends User {}

// Movie Types
export interface Movie {
  id?: number;
  title: string;
  genre: string;
  durationMinutes: number;
  releaseDate: string;
  showtimes?: Showtime[];
}

export interface AddMovieRequest {
  title: string;
  genre: string;
  durationMinutes: number;
  releaseDate: string;
}

// Hall Types
export interface Hall {
  id?: number;
  name: string;
  totalSeats: number;
  seats?: Seat[];
  showtimes?: Showtime[];
}

export interface AddHallRequest {
  name: string;
  totalSeats: number;
}

// Seat Types
export interface Seat {
  id?: number;
  seatNumber: string;
  hall?: Hall;
  available: boolean;
}

export interface UpdateSeatAvailabilityRequest {
  seatId: number;
  available: boolean;
}

// Showtime Types
export interface Showtime {
  id?: number;
  startTime: string;
  movie?: Movie;
  hall?: Hall;
  bookings?: Booking[];
}

export interface AddShowtimeRequest {
  startTime: string;
  movieId: number;
  hallId: number;
}

// Booking Types
export interface Booking {
  id?: number;
  user?: User;
  showtime?: Showtime;
  seatNumber: string;
  bookingTime?: string;
  price: number;
}

export interface BookSeatRequest {
  userId: number;
  showtimeId: number;
  seatNumber: string;
  price: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (user: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

