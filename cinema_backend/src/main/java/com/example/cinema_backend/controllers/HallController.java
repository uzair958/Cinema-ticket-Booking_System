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
        return ResponseEntity.ok(hallService.addHall(hall));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Hall>> getAllHalls() {
        return ResponseEntity.ok(hallService.getAllHalls());
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<List<Seat>> getSeatsForHall(@PathVariable Long id) {
        return ResponseEntity.ok(hallService.getSeatsForHall(id));
    }
}
