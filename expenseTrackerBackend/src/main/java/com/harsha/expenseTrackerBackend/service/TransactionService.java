package com.harsha.expenseTrackerBackend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.harsha.expenseTrackerBackend.model.Transaction;
import com.harsha.expenseTrackerBackend.model.User;
import com.harsha.expenseTrackerBackend.repository.TransactionRepository;
import com.harsha.expenseTrackerBackend.util.Constants;

@Service
@Transactional
public class TransactionService {

	@Autowired
	private TransactionRepository transactionRepository;

	public Transaction addTransaction(Transaction transaction) {
		return transactionRepository.save(transaction);
	}

	public void deleteTransactionById(String transactionId) {
		transactionRepository.deleteById(transactionId);
	}

	public List<Transaction> getTransactions(User user, int limit, String searchText, String sortField,
			String sortOrder, String expenseType) {
		Sort.Direction direction = !sortOrder.equalsIgnoreCase(Constants.ASC) ? Sort.Direction.DESC
				: Sort.Direction.ASC;

		Sort sort = Sort.by(direction, sortField != null && !sortField.isEmpty() ? sortField : Constants.DATE);

		Pageable pageable = limit > 0 ? PageRequest.of(0, limit, sort) : null;

		if (expenseType.equals("all"))
			expenseType = null;

		if (expenseType != null && !expenseType.isEmpty() && searchText != null && !searchText.isEmpty()) {
			return pageable != null
					? transactionRepository.findByCreatedUserAndTypeAndNoteContainingIgnoreCase(user, expenseType,
							searchText, pageable)
					: transactionRepository.findByCreatedUserAndTypeAndNoteContainingIgnoreCase(user, expenseType,
							searchText);
		}  else if (expenseType != null && !expenseType.isEmpty()) {
			return pageable != null ? transactionRepository.findByCreatedUserAndType(user, expenseType, pageable)
					: transactionRepository.findByCreatedUserAndType(user, expenseType);
		} else if (searchText != null && !searchText.isEmpty()) {
			return pageable != null
					? transactionRepository.findByCreatedUserAndNoteContainingIgnoreCase(user, searchText, pageable)
					: transactionRepository.findByCreatedUserAndNoteContainingIgnoreCase(user, searchText);
		} else {
			return pageable != null ? transactionRepository.findByCreatedUser(user, pageable)
					: transactionRepository.findByCreatedUser(user);
		}
	}

	public BigDecimal getTransactionByTypeAndDateRange(User user, String type, Date startDate, Date endDate) {
		List<Transaction> transactions = transactionRepository.findByCreatedUserAndTypeAndDateBetween(user, type,
				startDate, endDate);
		BigDecimal total = BigDecimal.ZERO;
		for (Transaction transaction : transactions)
			total = total.add(transaction.getAmount());
		return total;
	}

	public List<BigDecimal> getIncomesExpensesByDateRange(User user, Date startDate, Date endDate) {
		if (startDate == null) {
			startDate = new Date(0);
		}
		if (endDate == null) {
			endDate = new Date();
		}

		List<BigDecimal> totals = new ArrayList<>();
		totals.add(getTransactionByTypeAndDateRange(user, Constants.INCOME, startDate, endDate));
		totals.add(getTransactionByTypeAndDateRange(user, Constants.EXPENSE, startDate, endDate));
		return totals;
	}

	public Optional<Transaction> getTransactionById(String id) {
		return transactionRepository.findById(id);
	}

}
