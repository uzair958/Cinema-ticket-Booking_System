package com.example.cinema_backend.services;

import com.example.cinema_backend.entities.Showtime;
import com.example.cinema_backend.entities.Movie;
import com.example.cinema_backend.entities.Hall;
import com.example.cinema_backend.repositories.ShowtimeRepository;
import com.example.cinema_backend.repositories.MovieRepository;
import com.example.cinema_backend.repositories.HallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShowtimeService {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private HallRepository hallRepository;

    public Showtime addShowtime(Showtime showtime) {
        // Fetch the actual Movie and Hall entities from database
        if (showtime.getMovie() != null && showtime.getMovie().getId() != null) {
            Movie movie = movieRepository.findById(showtime.getMovie().getId())
                    .orElseThrow(() -> new RuntimeException("Movie not found with id: " + showtime.getMovie().getId()));
            showtime.setMovie(movie);
        }

        if (showtime.getHall() != null && showtime.getHall().getId() != null) {
            Hall hall = hallRepository.findById(showtime.getHall().getId())
                    .orElseThrow(() -> new RuntimeException("Hall not found with id: " + showtime.getHall().getId()));
            showtime.setHall(hall);
        }

        return showtimeRepository.save(showtime);
    }

    public List<Showtime> getUpcomingShowtimes() {
        return showtimeRepository.findByStartTimeAfter(LocalDateTime.now());
    }

    public List<Showtime> getShowtimesByMovie(Long movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }

    public Showtime getShowtimeById(Long id) {
        System.out.println("✅ ShowtimeService.getShowtimeById() called with ID: " + id);
        return showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found with id: " + id));
    }

    public Showtime updateShowtime(Long id, Showtime showtimeDetails) {
        System.out.println("✅ ShowtimeService.updateShowtime() called with ID: " + id);
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found with id: " + id));

        if (showtimeDetails.getStartTime() != null) {
            showtime.setStartTime(showtimeDetails.getStartTime());
        }

        if (showtimeDetails.getMovie() != null && showtimeDetails.getMovie().getId() != null) {
            Movie movie = movieRepository.findById(showtimeDetails.getMovie().getId())
                    .orElseThrow(() -> new RuntimeException("Movie not found with id: " + showtimeDetails.getMovie().getId()));
            showtime.setMovie(movie);
        }

        if (showtimeDetails.getHall() != null && showtimeDetails.getHall().getId() != null) {
            Hall hall = hallRepository.findById(showtimeDetails.getHall().getId())
                    .orElseThrow(() -> new RuntimeException("Hall not found with id: " + showtimeDetails.getHall().getId()));
            showtime.setHall(hall);
        }

        Showtime updatedShowtime = showtimeRepository.save(showtime);
        System.out.println("✅ Showtime updated with ID: " + updatedShowtime.getId());
        return updatedShowtime;
    }

    public void deleteShowtime(Long id) {
        System.out.println("✅ ShowtimeService.deleteShowtime() called with ID: " + id);
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found with id: " + id));
        showtimeRepository.delete(showtime);
        System.out.println("✅ Showtime deleted with ID: " + id);
    }
}
