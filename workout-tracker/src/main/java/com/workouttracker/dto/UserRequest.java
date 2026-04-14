package com.workouttracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {
	@NotBlank(message = "Should not be empty!")
	@Size(max=100, message = "Should be less then 100!")
    private String name;
	@NotBlank(message = "Should not be empty!")
	@Size(max=100, message = "Should be less than 100!")
	@Email(message = "Inapropriate email form! Shoud include '@' and domain!")
	private String email;
}
