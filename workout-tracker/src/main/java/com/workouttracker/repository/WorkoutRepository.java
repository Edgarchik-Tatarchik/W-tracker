package com.workouttracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workouttracker.entity.User;
import com.workouttracker.entity.Workout;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
	List<Workout> findByUser(User user);
}

