package com.workouttracker.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class ControllerAdvice {
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> errorHandler(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		for (FieldError error : ex.getBindingResult().getFieldErrors()) {
		    errors.put(error.getField(),error.getDefaultMessage());
		    
		}
		return ResponseEntity.badRequest().body(errors);
	}
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, String>> handleParseError(HttpMessageNotReadableException ex) {
	    Map<String, String> errors = new HashMap<>();
	    errors.put("error", "Invalid request format");
	    return ResponseEntity.badRequest().body(errors);
	}
	
		@ExceptionHandler(IllegalArgumentException.class)
		public ResponseEntity<Map<String, String>> errorHandler(IllegalArgumentException ex){
			Map<String, String> errors = new HashMap<>();
			 errors.put("error", ex.getMessage());
			    return ResponseEntity.badRequest().body(errors);
		}
}
