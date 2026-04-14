package com.workouttracker.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workouttracker.entity.Exercise;
import com.workouttracker.entity.User;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
	@Query("SELECT DISTINCT e.name FROM Exercise e WHERE e.workout.user = :user ORDER BY e.name")
	List<String> findDistinctNamesByUser(@Param("user") User user);	
	@Query("SELECT e FROM Exercise e WHERE e.workout.user = :user AND LOWER(e.name) = LOWER(:name) ORDER BY e.workout.date ASC")
	List<Exercise> findByUserAndName(@Param("user") User user, @Param("name") String name);
	@Query("SELECT e FROM Exercise e WHERE e.workout.user = :user AND e.name = :name ORDER BY e.workout.date DESC")
	List<Exercise> findLastByUserAndName(@Param("user") User user, @Param("name") String name, Pageable pageable);
}
