package com.workouttracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workouttracker.dto.ExerciseDto;
import com.workouttracker.dto.WorkoutRequest;
import com.workouttracker.dto.WorkoutResponse;
import com.workouttracker.entity.User;
import com.workouttracker.service.UserService;
import com.workouttracker.service.WorkoutService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/workouts")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @Autowired
    private UserService userService;

    private User getCurrentUser() {
        Long userId = (Long) SecurityContextHolder
        .getContext().getAuthentication().getPrincipal();
        return userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public WorkoutResponse createWorkout(@Valid @RequestBody WorkoutRequest request) {
        return workoutService.createWorkout(request, getCurrentUser());
    }
    
    @PostMapping("/{workoutId}/exercises")
    public ResponseEntity<Void> addExercise(@PathVariable long workoutId, @RequestBody ExerciseDto dto) {
        workoutService.addExercise(workoutId, dto, getCurrentUser());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<WorkoutResponse> getAll() {
        return workoutService.getWorkoutsByUser(getCurrentUser());
    }

    @GetMapping("/{id}")
    public WorkoutResponse getById(@PathVariable long id) {
        return workoutService.getById(id, getCurrentUser());
    }
    
    @PutMapping("/{id}")
    public WorkoutResponse updateWorkout(@Valid @PathVariable long id, @RequestBody WorkoutRequest request) {
        return workoutService.updateWorkout(id, request, getCurrentUser());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable long id) {
        workoutService.deleteById(id, getCurrentUser());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{workoutId}/exercises/{exerciseId}")
    public ResponseEntity<Void> deleteExercise(@PathVariable long workoutId, @PathVariable long exerciseId) {
        workoutService.deleteExercise(workoutId, exerciseId, getCurrentUser());
        return ResponseEntity.noContent().build();
    }
}