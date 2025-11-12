package com.example.cinema_backend.repositories;

import com.example.cinema_backend.entities.Booking;
import com.example.cinema_backend.entities.Showtime;
import com.example.cinema_backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find bookings by User entity
    List<Booking> findByUser(User user);

    // Find bookings by Showtime entity
    List<Booking> findByShowtime(Showtime showtime);

    // Check if a seat is already booked for a specific showtime
    boolean existsByShowtimeAndSeatNumber(Showtime showtime, String seatNumber);
}
