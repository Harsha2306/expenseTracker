package com.harsha.expenseTrackerBackend.util;

import java.util.List;

import com.harsha.expenseTrackerBackend.model.Category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categories {
	List<Category> income;
	List<Category> expense;
}
