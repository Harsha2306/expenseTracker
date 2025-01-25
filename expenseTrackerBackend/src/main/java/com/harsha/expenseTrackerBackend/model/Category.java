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
public class Category {
	@Id
	private String id;
	@Indexed(unique = true)
	private String name;
	@NonNull
	private String iconPath;
	@NonNull
	private String type; 
}
