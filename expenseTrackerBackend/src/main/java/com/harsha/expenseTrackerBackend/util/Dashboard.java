package com.harsha.expenseTrackerBackend.util;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.harsha.expenseTrackerBackend.model.Transaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dashboard {
	private String fullName;
	private Map<String, List<BigDecimal>> incomesExpenses;
	private List<Transaction> recentTransactions;
}
