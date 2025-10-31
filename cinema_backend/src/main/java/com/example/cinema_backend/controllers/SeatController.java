package com.example.cinema_backend.controllers;

import com.example.cinema_backend.entities.Seat;
import com.example.cinema_backend.services.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/available/{hallId}")
    public ResponseEntity<List<Seat>> getAvailableSeats(@PathVariable Long hallId) {
        return ResponseEntity.ok(seatService.getAvailableSeats(hallId));
    }

    @PutMapping("/{seatId}/availability")
    public ResponseEntity<Seat> updateSeatAvailability(@PathVariable Long seatId,
                                                       @RequestParam boolean available) {
        return ResponseEntity.ok(seatService.updateSeatAvailability(seatId, available));
    }
}
