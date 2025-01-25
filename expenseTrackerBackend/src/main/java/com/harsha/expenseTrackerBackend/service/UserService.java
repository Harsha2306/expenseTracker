package com.harsha.expenseTrackerBackend.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harsha.expenseTrackerBackend.model.Transaction;
import com.harsha.expenseTrackerBackend.model.User;
import com.harsha.expenseTrackerBackend.repository.UserRepository;
import com.harsha.expenseTrackerBackend.util.Constants;
import com.harsha.expenseTrackerBackend.util.Dashboard;
import com.harsha.expenseTrackerBackend.util.DateUtil;
import com.harsha.expenseTrackerBackend.util.PasswordUtil;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TransactionService transactionService;
	
	@Autowired
	private DateUtil dateUtil;

	public void addUser(User user) {
		user.setPassword(PasswordUtil.encodePassword(user.getPassword()));
		userRepository.save(user);
	}

	public Optional<User> getUserById(String id) {
		return userRepository.findById(id);
	}

	public User findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	public Dashboard getUserDashboardByEmail(String email) {
		User user = findByEmail(email);
		String fullName = user.getFullName();
		List<Transaction> recentTransactions = transactionService.getTransactions(user, 3, "", Constants.DATE, Constants.DSC, Constants.ALL);

		Map<String, List<BigDecimal>> incomesExpenses = new HashMap<String, List<BigDecimal>>();
		incomesExpenses.put("thisMonth", transactionService.getIncomesExpensesByDateRange(user,
				dateUtil.getStartOfMonth(new Date()), dateUtil.getEndOfMonth(new Date())));
		incomesExpenses.put("year", transactionService.getIncomesExpensesByDateRange(user,
				dateUtil.getStartOfYear(new Date()), dateUtil.getEndOfYear(new Date())));
		incomesExpenses.put("allTime", transactionService.getIncomesExpensesByDateRange(user, null, null));
		
		return new Dashboard(fullName, incomesExpenses, recentTransactions);
	}
}
