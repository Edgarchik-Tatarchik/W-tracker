package com.workouttracker.dto;


public class ExerciseDto {
    private String name;
    private Integer sets;
    private Integer reps;
    private Double weight;
    private Long id;
    
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getSets() { return sets; }
    public void setSets(Integer sets) { this.sets = sets; }

    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; } 
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}