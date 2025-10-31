package com.example.cinema_backend.repositories;

import com.example.cinema_backend.entities.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByHallId(Long hallId);
    List<Seat> findByIsAvailableTrueAndHallId(Long hallId);
}
