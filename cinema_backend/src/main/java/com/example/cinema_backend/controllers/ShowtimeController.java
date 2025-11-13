package com.example.cinema_backend.controllers;

import com.example.cinema_backend.entities.Showtime;
import com.example.cinema_backend.services.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    @PostMapping("/add")
    public ResponseEntity<Showtime> addShowtime(@RequestBody Showtime showtime) {
        System.out.println("🎬 Adding Showtime");
        return ResponseEntity.ok(showtimeService.addShowtime(showtime));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Showtime>> getUpcomingShowtimes() {
        return ResponseEntity.ok(showtimeService.getUpcomingShowtimes());
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Showtime>> getShowtimesByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(showtimeService.getShowtimesByMovie(movieId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Showtime> getShowtimeById(@PathVariable Long id) {
        System.out.println("🎬 Fetching showtime with ID: " + id);
        return ResponseEntity.ok(showtimeService.getShowtimeById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Showtime> updateShowtime(@PathVariable Long id, @RequestBody Showtime showtime) {
        System.out.println("🎬 Updating Showtime ID: " + id);
        return ResponseEntity.ok(showtimeService.updateShowtime(id, showtime));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteShowtime(@PathVariable Long id) {
        System.out.println("🎬 Deleting Showtime ID: " + id);
        showtimeService.deleteShowtime(id);
        return ResponseEntity.ok("Showtime deleted successfully");
    }
}
