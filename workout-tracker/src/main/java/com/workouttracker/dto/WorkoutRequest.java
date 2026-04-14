package com.workouttracker.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data

public class WorkoutRequest {
	@NotBlank(message = "Should not be empty!")
	@Size(max=100, message = "Name's length should be less then 100 characters")
    private String name;
	@Min(value = 10, message = "Should be more than 10!")
	@Max(value = 600, message = "Should be less than 600!")
    private int length;
	@NotNull(message = "Should not be empty!")
    private LocalDate date;
	@Size(max=500, message = "This note is too long !")
    private String notes;
	
	private List<ExerciseDto> exercises;
	public List<ExerciseDto> getExercises() { return exercises; }
	public void setExercises(List<ExerciseDto> exercises) { this.exercises = exercises; }
}
