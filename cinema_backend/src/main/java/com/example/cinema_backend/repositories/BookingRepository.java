package com.example.cinema_backend.repositories;

import com.example.cinema_backend.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByShowtimeId(Long showtimeId);
    boolean existsByShowtimeIdAndSeatNumber(Long showtimeId, String seatNumber);
}
