package com.harsha.expenseTrackerBackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.mongodb.lang.NonNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
	@Id
	private String id;
	@NonNull
	private String fullName;
	@NonNull
	@Indexed(unique = true)
	private String email;
	@NonNull
	private String password;
	@NonNull
	private String role = "USER";
}