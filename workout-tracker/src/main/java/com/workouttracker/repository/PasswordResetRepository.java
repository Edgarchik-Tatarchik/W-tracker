package com.workouttracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workouttracker.entity.PasswordResetToken;
import com.workouttracker.entity.User;

public interface PasswordResetRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteAllByUser(User user);
    
}
