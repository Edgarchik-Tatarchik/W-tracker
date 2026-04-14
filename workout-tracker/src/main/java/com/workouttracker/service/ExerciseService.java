package com.workouttracker.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.workouttracker.dto.ExerciseDto;
import com.workouttracker.dto.ProgressionDto;
import com.workouttracker.entity.Exercise;
import com.workouttracker.entity.User;
import com.workouttracker.repository.ExerciseRepository;

@Service
public class ExerciseService {

    @Autowired
    private ExerciseRepository exerciseRepository;

    public List<ProgressionDto> getProgression(User user) {
        List<String> names = exerciseRepository.findDistinctNamesByUser(user);
        List<ProgressionDto> result = new ArrayList<>();

        for (String name : names) {
            List<Exercise> last3 = exerciseRepository.findLastByUserAndName(
                user, name, PageRequest.of(0, 3)
            );
            if (last3.isEmpty()) continue;

            Exercise latest = last3.get(0);
            ProgressionDto dto = new ProgressionDto();
            dto.setExerciseName(name);
            dto.setLastWeight(latest.getWeight());
            dto.setLastSets(latest.getSets());
            dto.setLastReps(latest.getReps());

            if (last3.size() == 3) {
                boolean allStrong = last3.stream()
                    .allMatch(e -> e.getReps() >= latest.getReps());
                if (allStrong) {
                    dto.setRecommendation("INCREASE");
                    dto.setSuggestedWeight(latest.getWeight() + 2.5);
                } else if (last3.get(0).getReps() < latest.getReps() * 0.9) {
                    dto.setRecommendation("DECREASE");
                    dto.setSuggestedWeight(Math.max(0, latest.getWeight() - 2.5));
                } else {
                    dto.setRecommendation("HOLD");
                    dto.setSuggestedWeight(latest.getWeight());
                }
            } else {
                dto.setRecommendation("HOLD");
                dto.setSuggestedWeight(latest.getWeight());
            }

            result.add(dto);
        }
        return result;
    }
    public ExerciseDto getPrevious(String name, User user) {
        List<Exercise> last = exerciseRepository.findLastByUserAndName(
            user, name, PageRequest.of(0, 1)
        );
        if (last.isEmpty()) return null;
        Exercise e = last.get(0);
        ExerciseDto dto = new ExerciseDto();
        dto.setName(e.getName());
        dto.setSets(e.getSets());
        dto.setReps(e.getReps());
        dto.setWeight(e.getWeight());
        return dto;
    }
}