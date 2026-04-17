package com.workouttracker.controller;



import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workouttracker.dto.LoginRequest;
import com.workouttracker.dto.RegisterRequest;
import com.workouttracker.entity.User;
import com.workouttracker.security.JwtUtil;
import com.workouttracker.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
	@Autowired
	private UserService userService;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@PostMapping("/register")
	public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
	    request.setEmail(request.getEmail().trim().toLowerCase());
	    request.setName(request.getName().trim());
	    if(userService.findByEmail(request.getEmail()).isPresent()) {
	        return ResponseEntity.status(409).body(Map.of("error", "This email is already exist"));
	    }
	    User user = userService.createUser(request);
	    String token = jwtUtil.generateToken(user.getId());
	    ResponseCookie cookie = ResponseCookie.from("access_token", token)
	        .httpOnly(true)
	        .secure(true)
	        .sameSite("None")
	        .path("/")
	        .maxAge(Duration.ofHours(1))
	        .build();
	    return ResponseEntity.status(HttpStatus.CREATED)
	        .header(HttpHeaders.SET_COOKIE, cookie.toString())
	        .body(Map.of("message", "User has been created"));
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
	    request.setEmail(request.getEmail().trim().toLowerCase());

	    User user = userService.findByEmail(request.getEmail()).orElse(null);
	    
	    if (user == null || user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body(Map.of("error", "Wrong email or password"));
	    }

	    String token = jwtUtil.generateToken(user.getId());

	    ResponseCookie cookie = ResponseCookie.from("access_token", token)
	            .httpOnly(true)
	            .secure(false)
	            .sameSite("Lax")
	            .path("/")
	            .maxAge(Duration.ofHours(1))
	            .build();

	    return ResponseEntity.ok()
	            .header(HttpHeaders.SET_COOKIE, cookie.toString())
	            .body(Map.of(
	            	    "message", "Login successful",
	            	    "user", Map.of(
	            	        "id", user.getId(),
	            	        "email", user.getEmail(),
	            	        "name", user.getName()
	            	    )
	            	));
	}
	@GetMapping("/me")
	public ResponseEntity<?> me(Authentication authentication) {
	    if (authentication == null || !authentication.isAuthenticated()) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body(Map.of("error", "Unauthorized"));
	    }

	    Long userId = (Long) authentication.getPrincipal();
	    User user = userService.findById(userId).orElseThrow();

	    return ResponseEntity.ok(Map.of(
	            "email", user.getEmail(),
	            "name", user.getName()
	    ));
	}
	@PostMapping("/logout")
	public ResponseEntity<?> logout() {
	    ResponseCookie cookie = ResponseCookie.from("access_token", "")
	            .httpOnly(true)
	            .secure(false) 
	            .path("/")
	            .maxAge(0)
	            .sameSite("Lax")
	            .build();

	    return ResponseEntity.ok()
	            .header(HttpHeaders.SET_COOKIE, cookie.toString())
	            .body(Map.of("message", "Logged out"));
	}
}
