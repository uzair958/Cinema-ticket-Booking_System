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

    /**
     * Retrieves all bookings (Admin only).
     * @return List of all Booking objects
     */
    public List<Booking> getAllBookings() {
        System.out.println("✅ BookingService.getAllBookings() called");
        List<Booking> bookings = bookingRepository.findAll();
        System.out.println("✅ Total bookings: " + bookings.size());
        return bookings;
    }

    /**
     * Retrieves a booking by ID.
     * @param id ID of the booking
     * @return Booking object
     */
    public Booking getBookingById(Long id) {
        System.out.println("✅ BookingService.getBookingById() called with ID: " + id);
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    /**
     * Deletes a booking and marks the seat as available.
     * @param id ID of the booking to delete
     */
    public void deleteBooking(Long id) {
        System.out.println("✅ BookingService.deleteBooking() called with ID: " + id);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        // Mark seat as available again
        Seat seat = seatRepository.findAll().stream()
                .filter(s -> s.getSeatNumber().equals(booking.getSeatNumber()))
                .findFirst()
                .orElse(null);

        if (seat != null) {
            seat.setAvailable(true);
            seatRepository.save(seat);
            System.out.println("✅ Seat " + booking.getSeatNumber() + " marked as available");
        }

        // Delete the booking
        bookingRepository.delete(booking);
        System.out.println("✅ Booking deleted with ID: " + id);
    }

    /**
     * Updates a booking (Admin only).
     * @param id ID of the booking
     * @param bookingDetails Updated booking details
     * @return Updated Booking object
     */
    public Booking updateBooking(Long id, Booking bookingDetails) {
        System.out.println("✅ BookingService.updateBooking() called with ID: " + id);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        if (bookingDetails.getPrice() > 0) {
            booking.setPrice(bookingDetails.getPrice());
        }

        if (bookingDetails.getSeatNumber() != null && !bookingDetails.getSeatNumber().isEmpty()) {
            booking.setSeatNumber(bookingDetails.getSeatNumber());
        }

        Booking updatedBooking = bookingRepository.save(booking);
        System.out.println("✅ Booking updated with ID: " + updatedBooking.getId());
        return updatedBooking;
    }
}
