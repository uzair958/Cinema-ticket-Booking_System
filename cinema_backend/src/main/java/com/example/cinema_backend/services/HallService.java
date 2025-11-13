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
        System.out.println("✅ HallService.addHall() called with: " + hall.getName() + ", seats: " + hall.getTotalSeats());
        Hall savedHall = hallRepository.save(hall);
        System.out.println("✅ Hall saved with ID: " + savedHall.getId());

        // Create seats for the hall
        int totalSeats = hall.getTotalSeats();
        System.out.println("🪑 Creating " + totalSeats + " seats for hall: " + savedHall.getName());

        for (int i = 1; i <= totalSeats; i++) {
            // Generate seat numbers: A1, A2, ..., A10, B1, B2, etc.
            int row = (i - 1) / 10; // 0-9 = row A, 10-19 = row B, etc.
            int col = (i - 1) % 10 + 1; // 1-10
            char rowChar = (char) ('A' + row);
            String seatNumber = rowChar + String.valueOf(col);

            Seat seat = Seat.builder()
                    .seatNumber(seatNumber)
                    .isAvailable(true)
                    .hall(savedHall)
                    .build();

            seatRepository.save(seat);
        }

        System.out.println("✅ " + totalSeats + " seats created for hall ID: " + savedHall.getId());
        return savedHall;
    }

    public List<Hall> getAllHalls() {
        List<Hall> halls = hallRepository.findAll();
        System.out.println("✅ HallService.getAllHalls() returned " + halls.size() + " halls");
        for (Hall hall : halls) {
            System.out.println("   - Hall ID: " + hall.getId() + ", Name: " + hall.getName() + ", Seats: " + hall.getTotalSeats());
        }
        return halls;
    }

    public Hall getHallById(Long id) {
        System.out.println("✅ HallService.getHallById() called with ID: " + id);
        return hallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hall not found with id: " + id));
    }

    public Hall updateHall(Long id, Hall hallDetails) {
        System.out.println("✅ HallService.updateHall() called with ID: " + id);
        Hall hall = hallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hall not found with id: " + id));

        if (hallDetails.getName() != null && !hallDetails.getName().isEmpty()) {
            hall.setName(hallDetails.getName());
        }

        if (hallDetails.getTotalSeats() > 0) {
            int oldTotalSeats = hall.getTotalSeats();
            int newTotalSeats = hallDetails.getTotalSeats();

            hall.setTotalSeats(newTotalSeats);

            // If seats increased, create new seats
            if (newTotalSeats > oldTotalSeats) {
                System.out.println("🪑 Adding " + (newTotalSeats - oldTotalSeats) + " new seats to hall: " + hall.getName());

                for (int i = oldTotalSeats + 1; i <= newTotalSeats; i++) {
                    int row = (i - 1) / 10;
                    int col = (i - 1) % 10 + 1;
                    char rowChar = (char) ('A' + row);
                    String seatNumber = rowChar + String.valueOf(col);

                    Seat seat = Seat.builder()
                            .seatNumber(seatNumber)
                            .isAvailable(true)
                            .hall(hall)
                            .build();

                    seatRepository.save(seat);
                }

                System.out.println("✅ " + (newTotalSeats - oldTotalSeats) + " new seats created");
            }
        }

        Hall updatedHall = hallRepository.save(hall);
        System.out.println("✅ Hall updated with ID: " + updatedHall.getId());
        return updatedHall;
    }

    public void deleteHall(Long id) {
        System.out.println("✅ HallService.deleteHall() called with ID: " + id);
        Hall hall = hallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hall not found with id: " + id));

        // Delete all seats associated with this hall
        seatRepository.deleteAll(seatRepository.findByHallId(id));

        // Delete the hall
        hallRepository.delete(hall);
        System.out.println("✅ Hall deleted with ID: " + id);
    }

    public List<Seat> getSeatsForHall(Long hallId) {
        return seatRepository.findByHallId(hallId);
    }
}
