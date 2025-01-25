package com.harsha.expenseTrackerBackend.validators;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.harsha.expenseTrackerBackend.model.Transaction;
import com.harsha.expenseTrackerBackend.model.User;
import com.harsha.expenseTrackerBackend.service.CategoryService;
import com.harsha.expenseTrackerBackend.service.TransactionService;

@Component
public class TransactionValidator {

	@Autowired
	CategoryService categoryService;
	@Autowired
	TransactionService transactionService;

	public Map<String, String> validateGetTransaction(String transactionId, User user) {
		Map<String, String> errors = new HashMap<>();
		try {
			Optional<Transaction> optionalTransaction = transactionService.getTransactionById(transactionId);
			if (optionalTransaction.isEmpty()) {
				errors.put("", "Transaction not found");
				return errors;
			}
			Transaction transaction = optionalTransaction.get();
			if (!transaction.getCreatedUser().getId().equals(user.getId()))
				errors.put("", "operation not allowed");

		} catch (IllegalArgumentException illegalArgumentException) {
			errors.put("", "Transaction not found");
		}
		return errors;
	}

}
