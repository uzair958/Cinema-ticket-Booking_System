package com.example.cinema_backend.services;

import com.example.cinema_backend.entities.Hall;
import com.example.cinema_backend.entities.Seat;
import com.example.cinema_backend.repositories.HallRepository;
import com.example.cinema_backend.repositories.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HallService {

    @Autowired
    private HallRepository hallRepository;

    @Autowired
    private SeatRepository seatRepository;

    public Hall addHall(Hall hall) {
        return hallRepository.save(hall);
    }

    public List<Hall> getAllHalls() {
        return hallRepository.findAll();
    }

    public List<Seat> getSeatsForHall(Long hallId) {
        return seatRepository.findByHallId(hallId);
    }
}
