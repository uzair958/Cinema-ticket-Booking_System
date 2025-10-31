package com.example.cinema_backend.services;

import com.example.cinema_backend.entities.Showtime;
import com.example.cinema_backend.repositories.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShowtimeService {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    public Showtime addShowtime(Showtime showtime) {
        return showtimeRepository.save(showtime);
    }

    public List<Showtime> getUpcomingShowtimes() {
        return showtimeRepository.findByStartTimeAfter(LocalDateTime.now());
    }

    public List<Showtime> getShowtimesByMovie(Long movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }
}
