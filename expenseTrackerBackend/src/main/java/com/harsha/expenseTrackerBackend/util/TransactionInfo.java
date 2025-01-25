package com.harsha.expenseTrackerBackend.util;

import java.util.List;

import com.harsha.expenseTrackerBackend.model.Transaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionInfo {
	private List<Transaction> transactions;
	private boolean hasMoreTransactions;
}
