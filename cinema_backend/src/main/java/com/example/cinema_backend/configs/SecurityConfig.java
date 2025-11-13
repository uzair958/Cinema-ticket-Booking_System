package com.example.cinema_backend.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json");
                            response.setStatus(401);
                            response.getWriter().write("{\"error\": \"Unauthorized\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType("application/json");
                            response.setStatus(403);
                            response.getWriter().write("{\"error\": \"Access Denied\"}");
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - Authentication (MUST be first)
                        .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        // Public endpoints - Read operations (GET)
                        .requestMatchers("GET", "/api/movies/public/**").permitAll()
                        .requestMatchers("GET", "/api/halls/all").permitAll()
                        .requestMatchers("GET", "/api/halls/*/seats").permitAll()
                        .requestMatchers("GET", "/api/seats/available/**").permitAll()
                        .requestMatchers("GET", "/api/showtimes/upcoming").permitAll()
                        .requestMatchers("GET", "/api/showtimes/movie/**").permitAll()

                        // Admin endpoints - CRUD operations
                        .requestMatchers("POST", "/api/movies/add").hasRole("ADMIN")
                        .requestMatchers("DELETE", "/api/movies/**").hasRole("ADMIN")
                        .requestMatchers("POST", "/api/halls/add").hasRole("ADMIN")
                        .requestMatchers("POST", "/api/showtimes/add").hasRole("ADMIN")

                        // Authenticated endpoints - User operations
                        .requestMatchers("POST", "/api/bookings/book").authenticated()
                        .requestMatchers("GET", "/api/bookings/user/**").authenticated()
                        .requestMatchers("PUT", "/api/seats/*/availability").authenticated()

                        // Swagger/API Docs
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
