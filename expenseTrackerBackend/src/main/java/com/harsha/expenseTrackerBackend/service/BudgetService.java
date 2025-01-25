package com.harsha.expenseTrackerBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.harsha.expenseTrackerBackend.model.Budget;
import com.harsha.expenseTrackerBackend.model.User;
import com.harsha.expenseTrackerBackend.repository.BudgetRepository;

@Service
@Transactional
public class BudgetService {

	@Autowired
	private BudgetRepository budgetRepository;

	public Budget createBudget(Budget budget) {
		return budgetRepository.save(budget);
	}
	
	public Budget getBudgetByForMonthAndUser(String forMonth, User user) {
		return budgetRepository.findByForMonthAndCreatedUser(forMonth, user);
	}
	
	public void deleteBudget(String budgetId) {
		budgetRepository.deleteById(budgetId);
	}
	
	
}
