package com.workouttracker.dto;

public class ProgressionDto {
	private String exerciseName;
    private double lastWeight;
    private int lastSets;
    private int lastReps;
    private String recommendation; // "INCREASE", "HOLD", "DECREASE"
    private double suggestedWeight;
    
    
    
    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }
    public double getLastWeight() { return lastWeight; }
    public void setLastWeight(double lastWeight) { this.lastWeight = lastWeight; }
    public int getLastSets() { return lastSets; }
    public void setLastSets(int lastSets) { this.lastSets = lastSets; }
    public int getLastReps() { return lastReps; }
    public void setLastReps(int lastReps) { this.lastReps = lastReps; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public double getSuggestedWeight() { return suggestedWeight; }
    public void setSuggestedWeight(double suggestedWeight) { this.suggestedWeight = suggestedWeight; }

}
