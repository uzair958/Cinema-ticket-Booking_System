package com.example.cinema_backend.entities;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "seats")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String seatNumber; // e.g., "A1", "B4"

    @JsonProperty("available")
    private boolean isAvailable = true;

    @ManyToOne
    @JoinColumn(name = "hall_id")
    @JsonIgnore
    private Hall hall;
}
