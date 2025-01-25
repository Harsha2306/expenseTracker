package com.harsha.expenseTrackerBackend.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.harsha.expenseTrackerBackend.model.Transaction;
import com.harsha.expenseTrackerBackend.model.User;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
	List<Transaction> findByCreatedUser(User user, Pageable pageable);
	
	List<Transaction> findByCreatedUserAndTypeAndDateBetween(User createdUser, String type, Date startDate, Date endDate);

	List<Transaction> findByCreatedUser(User user);
	
	List<Transaction> findByCreatedUserAndTypeAndNoteContainingIgnoreCase(User user, String expenseType, String note, Pageable pageable);
	
	List<Transaction> findByCreatedUserAndTypeAndNoteContainingIgnoreCase(User user, String expenseType, String note);
	
	List<Transaction> findByCreatedUserAndType(User user, String expenseType, Pageable pageable);
	
	List<Transaction> findByCreatedUserAndType(User user, String expenseType);
	
	List<Transaction> findByCreatedUserAndNoteContainingIgnoreCase(User user, String note, Pageable pageable);
	
	List<Transaction> findByCreatedUserAndNoteContainingIgnoreCase(User user, String note);

}
