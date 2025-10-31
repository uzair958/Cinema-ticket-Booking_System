package com.example.cinema_backend.controllers;

import com.example.cinema_backend.entities.Booking;
import com.example.cinema_backend.services.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/book")
    public ResponseEntity<Booking> bookSeat(@RequestParam Long userId,
                                            @RequestParam Long showtimeId,
                                            @RequestParam String seatNumber,
                                            @RequestParam double price) {
        return ResponseEntity.ok(bookingService.bookSeat(userId, showtimeId, seatNumber, price));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }
}
