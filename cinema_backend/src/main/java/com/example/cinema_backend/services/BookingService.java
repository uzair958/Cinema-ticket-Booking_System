package com.example.cinema_backend.services;

import com.example.cinema_backend.entities.Booking;
import com.example.cinema_backend.entities.Seat;
import com.example.cinema_backend.repositories.BookingRepository;
import com.example.cinema_backend.repositories.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatRepository seatRepository;

    public Booking bookSeat(Long userId, Long showtimeId, String seatNumber, double price) {
        // Check if seat is already booked for this showtime
        if (bookingRepository.existsByShowtimeIdAndSeatNumber(showtimeId, seatNumber)) {
            throw new RuntimeException("Seat already booked!");
        }

        // Mark seat as unavailable
        Seat seat = seatRepository.findAll().stream()
                .filter(s -> s.getSeatNumber().equals(seatNumber))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        seat.setIsAvailable(false);
        seatRepository.save(seat);

        // Save booking
        Booking booking = Booking.builder()
                .userId(userId)
                .showtimeId(showtimeId)
                .seatNumber(seatNumber)
                .price(price)
                .build();

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}
