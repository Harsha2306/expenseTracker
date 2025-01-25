package com.harsha.expenseTrackerBackend.model;

import java.math.BigDecimal;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.mongodb.lang.NonNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {
	@Id
	private String id;
	@NonNull
	private String forMonth;
	@NonNull
	private BigDecimal limit;
	@DBRef
	private User createdUser;
}
