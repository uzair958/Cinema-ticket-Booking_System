package com.example.cinema_backend.repositories;

import com.example.cinema_backend.entities.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    List<Showtime> findByMovieId(Long movieId);
    List<Showtime> findByHallId(Long hallId);
    List<Showtime> findByStartTimeAfter(LocalDateTime now);
}
