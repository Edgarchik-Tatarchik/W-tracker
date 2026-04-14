package com.workouttracker.dto;

import lombok.Data;

@Data
public class ExerciseStatPoint {
	private String date;
    private int sets;
    private int reps;
    private double weight;
    private double volume;
    
    public ExerciseStatPoint(String date, int sets, int reps, double weight) {
        this.date = date;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
        this.volume = sets * reps * weight;
    }
    public double getVolume() { return volume; }
}
