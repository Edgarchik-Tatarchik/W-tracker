package com.workouttracker.controller;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workouttracker.dto.ExerciseDto;
import com.workouttracker.dto.ExerciseStatPoint;
import com.workouttracker.dto.ProgressionDto;
import com.workouttracker.entity.Exercise;
import com.workouttracker.entity.User;
import com.workouttracker.repository.ExerciseRepository;
import com.workouttracker.service.ExerciseService;
import com.workouttracker.service.UserService;

@RestController
@RequestMapping("/exercises")
public class ExerciseController {
	@Autowired private ExerciseRepository exerciseRepository;
    @Autowired private UserService userService;
    @Autowired private ExerciseService exerciseService;
    private User getCurrentUser() {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findById(userId).orElseThrow();
    }
	@GetMapping("/my")
    public List<String> getMyExercises() {
        return exerciseRepository.findDistinctNamesByUser(getCurrentUser());
    }
	@GetMapping("/stats")
	public List<ExerciseStatPoint> getStats(@RequestParam String name) {
	    User user = getCurrentUser();
	    List<Exercise> exercises = exerciseRepository.findByUserAndName(user, name);
	    return exercises.stream().map(e -> new ExerciseStatPoint(
	        e.getWorkout().getDate().toString(),
	        e.getSets(),
	        e.getReps(),
	        e.getWeight()
	    )).collect(Collectors.toList());
	}
	@GetMapping("/progression")
	public List<ProgressionDto> getProgression() {
	    Long userId = (Long) SecurityContextHolder
	        .getContext().getAuthentication().getPrincipal();
	    User user = userService.findById(userId)
	        .orElseThrow(() -> new RuntimeException("User not found"));
	    return exerciseService.getProgression(user);
	}
	@GetMapping("/previous")
	public ResponseEntity<ExerciseDto> getPrevious(@RequestParam String name){
		Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		User user = userService.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		ExerciseDto dto = exerciseService.getPrevious(name, user);
		if(dto==null) return ResponseEntity.noContent().build();
		return ResponseEntity.ok(dto);
	}
	@GetMapping("/pr")
	public ResponseEntity<?>getPR(@RequestParam String name){
		Double maxWeight = exerciseRepository.findMaxWeightByUserAndName(getCurrentUser(), name);
		if(maxWeight == null) return ResponseEntity.noContent().build();
		return ResponseEntity.ok(Map.of("maxWeight", maxWeight));
	}
	@GetMapping("/history")
	public List<ExerciseStatPoint>getHistory(@RequestParam String name){
		User user = getCurrentUser();
		List<Exercise> exercises = exerciseRepository.findByUserAndName(user, name);
		return exercises.stream().map(e -> new ExerciseStatPoint(
				e.getWorkout().getDate().toString(),
				e.getSets(),
				e.getReps(),
				e.getWeight()
				)).collect(Collectors.toList());
	}
}
