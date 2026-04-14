package com.workouttracker.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workouttracker.dto.ExerciseDto;
import com.workouttracker.dto.WorkoutRequest;
import com.workouttracker.dto.WorkoutResponse;
import com.workouttracker.entity.Exercise;
import com.workouttracker.entity.User;
import com.workouttracker.entity.Workout;
import com.workouttracker.repository.ExerciseRepository;
import com.workouttracker.repository.WorkoutRepository;

import jakarta.transaction.Transactional;
@Service
public class WorkoutService {
	@Autowired
	private ExerciseRepository exerciseRepository;
	@Autowired
    private WorkoutRepository workoutRepository;
	
    public List<WorkoutResponse> getWorkoutsByUser(User user){
    	List<Workout> workouts = workoutRepository.findByUser(user);
    	List<WorkoutResponse> result = new ArrayList<>();
        for(Workout workout: workouts) {
        	result.add(toResponse(workout));
        }
        return result;
    }
    public WorkoutResponse getById(long id, User currentUser) {
        Workout workout = workoutRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Workout not found"));
        if (!workout.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        return toResponse(workout);
    }
    public void deleteById(long id,User currentUser) {
    	Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found"));
            if (!workout.getUser().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Access denied");
            }
            workoutRepository.delete(workout);
    }
    public WorkoutResponse createWorkout(WorkoutRequest request, User user) {
        if (request.getDate().getYear() < 2000) {
            throw new IllegalArgumentException("Date cannot be earlier than 2000!");
        }
        Workout workout = toEntity(request);
        workout.setUser(user);
        Workout saved = workoutRepository.save(workout);

        if (request.getExercises() != null) {
            for (ExerciseDto dto : request.getExercises()) {
                Exercise exercise = new Exercise();
                exercise.setName(dto.getName());
                exercise.setSets(dto.getSets());
                exercise.setReps(dto.getReps());
                exercise.setWeight(dto.getWeight());
                exercise.setWorkout(saved);
                exerciseRepository.save(exercise);
            }
        }
        return toResponse(saved);
    }
    public WorkoutResponse updateWorkout(long id, WorkoutRequest request,User currentUser) {
    	if (request.getDate().getYear() < 2000) {
            throw new IllegalArgumentException("Date cannot be earlier than 2000!");
        }
        Workout workout = workoutRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Workout not found"));
        if (!workout.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        workout.setName(request.getName());
        workout.setLength(request.getLength());
        workout.setDate(request.getDate());
        workout.setNotes(request.getNotes());
        Workout saved = workoutRepository.save(workout);
        return toResponse(saved);
    }
    @Transactional
    public void addExercise(long workoutId, ExerciseDto dto, User currentUser) {
        Workout workout = workoutRepository.findById(workoutId)
            .orElseThrow(() -> new RuntimeException("Workout not found"));
        if (!workout.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        Exercise exercise = new Exercise();
        exercise.setName(dto.getName());
        exercise.setSets(dto.getSets());
        exercise.setReps(dto.getReps());
        exercise.setWeight(dto.getWeight());
        exercise.setWorkout(workout);
        workout.getExercises().add(exercise);
        workoutRepository.save(workout);
    }
    
    @Transactional
    public void deleteExercise(long workoutId, long exerciseId, User currentUser) {
        Workout workout = workoutRepository.findById(workoutId)
            .orElseThrow(() -> new RuntimeException("Workout not found"));
        if (!workout.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        workout.getExercises().removeIf(e -> e.getId().equals(exerciseId));
        workoutRepository.save(workout);
    }
    private WorkoutResponse toResponse(Workout workout) {
    	WorkoutResponse response = new WorkoutResponse();
        response.setId(workout.getId());
        response.setName(workout.getName());
        response.setLength(workout.getLength());
        response.setDate(workout.getDate());
        response.setNotes(workout.getNotes());
        
        
        List<ExerciseDto> exerciseDtos = new ArrayList<>();
        for (Exercise exercise : workout.getExercises()) {
            ExerciseDto dto = new ExerciseDto();
            dto.setName(exercise.getName());
            dto.setSets(exercise.getSets());
            dto.setReps(exercise.getReps());
            dto.setWeight(exercise.getWeight());
            dto.setId(exercise.getId());
            exerciseDtos.add(dto);
        }
        response.setExercises(exerciseDtos);
        return response;
    }
    private Workout toEntity(WorkoutRequest workout) {
    	Workout workoutEnity = new Workout();
    	workoutEnity.setName(workout.getName());
        workoutEnity.setLength(workout.getLength());
        workoutEnity.setDate(workout.getDate());
        workoutEnity.setNotes(workout.getNotes());
        return workoutEnity;
    }
}
