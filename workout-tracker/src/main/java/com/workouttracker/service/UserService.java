package com.workouttracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.workouttracker.dto.RegisterRequest;
import com.workouttracker.entity.User;
import com.workouttracker.repository.PasswordResetRepository;
import com.workouttracker.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
	@Autowired
    private UserRepository userRepository;
	
	@Autowired
    private PasswordEncoder passwordEncoder;
	
	@Autowired
	private PasswordResetRepository passwordResetRepository;
	
    public List<User> getAll() {
        return userRepository.findAll();
    }
    public User getById(long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User is not found"));
    }
    @Transactional
    public void deleteById(long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        	passwordResetRepository.deleteAllByUser(user);
        	userRepository.deleteById(id);
    }
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    public User createUser(RegisterRequest request) {
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        return userRepository.save(user);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    public void changePassword (User user, String currentPassword, String newPassword) {
    	boolean checkPass = passwordEncoder.matches(currentPassword, user.getPassword());
    	if(checkPass == false) {
    		throw new IllegalArgumentException("Passwords don't match. Try again.");
    	}
    	user.setPassword(passwordEncoder.encode(newPassword));
    	userRepository.save(user);
    }
}
