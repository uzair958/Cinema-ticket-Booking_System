package com.example.cinema_backend.services;

import com.example.cinema_backend.entities.Movie;
import com.example.cinema_backend.repositories.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public Movie addMovie(Movie movie) {
        System.out.println("✅ MovieService.addMovie() called with: " + movie.getTitle());
        return movieRepository.save(movie);
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public List<Movie> searchByTitle(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    public Movie getMovieById(Long id) {
        System.out.println("✅ MovieService.getMovieById() called with ID: " + id);
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
    }

    public Movie updateMovie(Long id, Movie movieDetails) {
        System.out.println("✅ MovieService.updateMovie() called with ID: " + id);
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));

        if (movieDetails.getTitle() != null && !movieDetails.getTitle().isEmpty()) {
            movie.setTitle(movieDetails.getTitle());
        }

        if (movieDetails.getGenre() != null && !movieDetails.getGenre().isEmpty()) {
            movie.setGenre(movieDetails.getGenre());
        }

        if (movieDetails.getDurationMinutes() > 0) {
            movie.setDurationMinutes(movieDetails.getDurationMinutes());
        }

        if (movieDetails.getReleaseDate() != null) {
            movie.setReleaseDate(movieDetails.getReleaseDate());
        }

        Movie updatedMovie = movieRepository.save(movie);
        System.out.println("✅ Movie updated with ID: " + updatedMovie.getId());
        return updatedMovie;
    }

    public void deleteMovie(Long id) {
        System.out.println("✅ MovieService.deleteMovie() called with ID: " + id);
        movieRepository.deleteById(id);
    }
}
