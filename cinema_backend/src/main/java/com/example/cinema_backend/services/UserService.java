package com.example.cinema_backend.services;

import com.example.cinema_backend.entities.User;
import com.example.cinema_backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all registered users
     */
    public List<User> getAllUsers() {
        System.out.println("✅ UserService.getAllUsers() called");
        List<User> users = userRepository.findAll();
        System.out.println("✅ Total users: " + users.size());
        return users;
    }

    /**
     * Get user by ID
     */
    public User getUserById(Long id) {
        System.out.println("✅ UserService.getUserById() called with ID: " + id);
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    /**
     * Get user by email
     */
    public User getUserByEmail(String email) {
        System.out.println("✅ UserService.getUserByEmail() called with email: " + email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    /**
     * Update user role (Admin only)
     */
    public User updateUserRole(Long id, String role) {
        System.out.println("✅ UserService.updateUserRole() called with ID: " + id + ", role: " + role);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        try {
            User.Role userRole = User.Role.valueOf(role.toUpperCase());
            user.setRole(userRole);
            User updatedUser = userRepository.save(user);
            System.out.println("✅ User role updated to: " + userRole);
            return updatedUser;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + role + ". Must be ADMIN or USER");
        }
    }

    /**
     * Delete user
     */
    public void deleteUser(Long id) {
        System.out.println("✅ UserService.deleteUser() called with ID: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        userRepository.delete(user);
        System.out.println("✅ User deleted with ID: " + id);
    }
}

