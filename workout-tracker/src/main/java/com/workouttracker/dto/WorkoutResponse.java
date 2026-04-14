package com.workouttracker.dto;


import java.time.LocalDate;
import java.util.List;

import lombok.Data;
@Data
public class WorkoutResponse {
	private Long id;
    private String name;
    private int length;
    private LocalDate date;
    private String notes;
    private List<ExerciseDto> exercises;
}
