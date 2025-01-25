package com.harsha.expenseTrackerBackend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.harsha.expenseTrackerBackend.model.Budget;
import com.harsha.expenseTrackerBackend.model.User;

@Repository
public interface BudgetRepository extends MongoRepository<Budget, String>{
	public Budget findByForMonthAndCreatedUser(String forMonth, User createdUser);
}
