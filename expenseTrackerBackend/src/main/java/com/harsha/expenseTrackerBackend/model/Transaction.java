package com.harsha.expenseTrackerBackend.model;

import java.math.BigDecimal;
import java.util.Date;

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
public class Transaction {
	@Id
	private String id;
	@NonNull
	private BigDecimal amount;
	@DBRef
	private Category category;
	private String note;
	@NonNull
	private Date date;
	@NonNull
	private String type;
	@DBRef
	private User createdUser;
}
