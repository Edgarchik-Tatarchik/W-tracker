package com.workouttracker.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workouttracker.dto.ChangePasswordRequest;
import com.workouttracker.dto.UserRequest;
import com.workouttracker.entity.User;
import com.workouttracker.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private User getCurrentUser() {
        Long userId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        return userService.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping("/me")
    public User getUserProfile() {
        return getCurrentUser();
    }

    @PutMapping("/me")
    public User updateUserProfile(@Valid @RequestBody UserRequest user) {
        User currentUser = getCurrentUser();

        currentUser.setName(user.getName());
        currentUser.setEmail(user.getEmail());

        return userService.updateUser(currentUser);
    }

    @PutMapping("/me/password")
    public User updateUserPassword(@RequestBody ChangePasswordRequest request) {
        User currentUser = getCurrentUser();

        userService.changePassword(
                currentUser,
                request.getCurrentPassword(),
                request.getNewPassword()
        );

        return currentUser;
    }

    @DeleteMapping("/me")
    public void deleteUserProfile() {
        User currentUser = getCurrentUser();
        userService.deleteById(currentUser.getId());
    }
}