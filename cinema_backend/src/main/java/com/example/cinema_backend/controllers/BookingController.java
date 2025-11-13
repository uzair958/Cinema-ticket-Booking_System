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

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        System.out.println("🎬 Fetching all bookings (Admin)");
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        System.out.println("🎬 Fetching booking with ID: " + id);
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        System.out.println("🎬 Deleting booking with ID: " + id);
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking deleted successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody Booking bookingDetails) {
        System.out.println("🎬 Updating booking with ID: " + id);
        return ResponseEntity.ok(bookingService.updateBooking(id, bookingDetails));
    }
}
