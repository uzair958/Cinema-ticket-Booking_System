package com.example.cinema_backend.services;

import com.example.cinema_backend.entities.Seat;
import com.example.cinema_backend.repositories.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    public List<Seat> getAvailableSeats(Long hallId) {
        return seatRepository.findByIsAvailableTrueAndHallId(hallId);
    }

    public Seat updateSeatAvailability(Long seatId, boolean available) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        seat.setAvailable(available);
        return seatRepository.save(seat);
    }
}
