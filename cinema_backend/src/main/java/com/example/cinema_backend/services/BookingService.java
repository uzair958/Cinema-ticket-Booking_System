package com.example.cinema_backend.services;

import com.example.cinema_backend.entities.Booking;
import com.example.cinema_backend.entities.Seat;
import com.example.cinema_backend.entities.Showtime;
import com.example.cinema_backend.entities.User;
import com.example.cinema_backend.repositories.BookingRepository;
import com.example.cinema_backend.repositories.SeatRepository;
import com.example.cinema_backend.repositories.ShowtimeRepository;
import com.example.cinema_backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    /**
     * Books a seat for a given user and showtime.
     * @param userId ID of the user
     * @param showtimeId ID of the showtime
     * @param seatNumber Seat identifier
     * @param price Price of the seat
     * @return Booking object saved in DB
     */
    public Booking bookSeat(Long userId, Long showtimeId, String seatNumber, double price) {
        // Fetch User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch Showtime
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        // Check if seat is already booked for this showtime
        if (bookingRepository.existsByShowtimeAndSeatNumber(showtime, seatNumber)) {
            throw new RuntimeException("Seat already booked!");
        }

        // Fetch Seat
        Seat seat = seatRepository.findAll().stream()
                .filter(s -> s.getSeatNumber().equals(seatNumber))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        if (!seat.isAvailable()) {
            throw new RuntimeException("Seat is already marked unavailable!");
        }

        // Mark seat as unavailable
        seat.setAvailable(false);
        seatRepository.save(seat);

        // Create and save booking
        Booking booking = Booking.builder()
                .user(user)
                .showtime(showtime)
                .seatNumber(seatNumber)
                .price(price)
                .bookingTime(LocalDateTime.now())
                .build();

        return bookingRepository.save(booking);
    }

    /**
     * Retrieves all bookings for a given user.
     * @param userId ID of the user
     * @return List of Booking objects
     */
    public List<Booking> getBookingsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser(user);
    }
}
