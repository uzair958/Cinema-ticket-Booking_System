package com.example.cinema_backend.controllers;

import com.example.cinema_backend.entities.User;
import com.example.cinema_backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get all registered users (Admin only)
     */
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        System.out.println("👥 Fetching all users (Admin)");
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Get user by ID (Admin only)
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        System.out.println("👥 Fetching user with ID: " + id);
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /**
     * Get user by email (Admin only)
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        System.out.println("👥 Fetching user with email: " + email);
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    /**
     * Update user role (Admin only)
     */
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        System.out.println("👥 Updating user role for ID: " + id + " to: " + role);
        return ResponseEntity.ok(userService.updateUserRole(id, role));
    }

    /**
     * Delete user (Admin only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        System.out.println("👥 Deleting user with ID: " + id);
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}

