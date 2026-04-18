package com.workouttracker.dto;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 30, message = "Name must be between 2 and 30 characters")
    @Pattern(regexp = "^[A-Za-zА-Яа-я0-9 ]+$", message = "Name contains invalid characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be at least 6 characters")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    public String getName() {
        return name;
    }

    public void setName(String name) {
    	if (name != null) {
            this.name = name.trim();
        }
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
    	if (email != null) {
            this.email = email.trim().toLowerCase();
        }
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}