package com.example.cinema_backend.controllers;

import com.example.cinema_backend.entities.Hall;
import com.example.cinema_backend.entities.Seat;
import com.example.cinema_backend.services.HallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/halls")
@RequiredArgsConstructor
public class HallController {

    private final HallService hallService;

    @PostMapping("/add")
    public ResponseEntity<Hall> addHall(@RequestBody Hall hall) {
        System.out.println("🎬 Adding Hall: " + hall.getName() + " with " + hall.getTotalSeats() + " seats");
        return ResponseEntity.ok(hallService.addHall(hall));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Hall>> getAllHalls() {
        List<Hall> halls = hallService.getAllHalls();
        System.out.println("🎬 Fetching all halls. Count: " + halls.size());
        return ResponseEntity.ok(halls);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hall> getHallById(@PathVariable Long id) {
        System.out.println("🎬 Fetching hall with ID: " + id);
        return ResponseEntity.ok(hallService.getHallById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hall> updateHall(@PathVariable Long id, @RequestBody Hall hall) {
        System.out.println("🎬 Updating Hall ID: " + id + " with name: " + hall.getName());
        return ResponseEntity.ok(hallService.updateHall(id, hall));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHall(@PathVariable Long id) {
        System.out.println("🎬 Deleting Hall ID: " + id);
        hallService.deleteHall(id);
        return ResponseEntity.ok("Hall deleted successfully");
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<List<Seat>> getSeatsForHall(@PathVariable Long id) {
        return ResponseEntity.ok(hallService.getSeatsForHall(id));
    }
}
