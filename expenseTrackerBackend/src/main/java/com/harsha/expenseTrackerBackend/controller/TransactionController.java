package com.harsha.expenseTrackerBackend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.harsha.expenseTrackerBackend.model.Category;
import com.harsha.expenseTrackerBackend.model.Transaction;
import com.harsha.expenseTrackerBackend.model.User;
import com.harsha.expenseTrackerBackend.service.CategoryService;
import com.harsha.expenseTrackerBackend.service.TransactionService;
import com.harsha.expenseTrackerBackend.service.UserService;
import com.harsha.expenseTrackerBackend.util.Constants;
import com.harsha.expenseTrackerBackend.util.ErrorResponse;
import com.harsha.expenseTrackerBackend.util.SuccessResponse;
import com.harsha.expenseTrackerBackend.util.TransactionInfo;
import com.harsha.expenseTrackerBackend.validators.TransactionValidator;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(Constants.USER_ROUTE)
@Transactional
public class TransactionController extends BaseController {

	@Autowired
	private TransactionService transactionService;
	@Autowired
	private CategoryService categoryService;
	@Autowired
	private TransactionValidator transactionValidator;
	@Autowired
	private UserService userService;

	@PostMapping(Constants.NEW_TRANSACTION_ROUTE)
	public ResponseEntity<?> addTransaction(@RequestBody Transaction transaction,
			HttpServletRequest httpServletRequest) {
		try {
			if (!isAuthorized(httpServletRequest))
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new ErrorResponse(false, HttpStatus.UNAUTHORIZED.value(), Constants.NOT_AUTHORIZED, null));

			Optional<Category> optionalCategory = categoryService.getCategoryById(transaction.getCategory().getId());
			Category category = optionalCategory.get();
			transaction.setCategory(category);

			User user = userService.findByEmail(getEmail(httpServletRequest));
			transaction.setCreatedUser(user);
			transactionService.addTransaction(transaction);
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(new SuccessResponse<Transaction>(true, Constants.CREATED, null, HttpStatus.CREATED.value()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null));
		}
	}

	@PutMapping(Constants.EDIT_TRANSACTION_ROUTE)
	public ResponseEntity<?> editTransaction(@RequestBody Transaction updatedtransaction,
			@PathVariable String transactionId, HttpServletRequest httpServletRequest) {
		try {
			if (!isAuthorized(httpServletRequest))
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new ErrorResponse(false, HttpStatus.UNAUTHORIZED.value(), Constants.NOT_AUTHORIZED, null));

			User user = userService.findByEmail(getEmail(httpServletRequest));
			Map<String, String> validationErrors = transactionValidator.validateGetTransaction(transactionId, user);
			if (!validationErrors.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(false,
						HttpStatus.BAD_REQUEST.value(), Constants.VALIDATION_FAILED, validationErrors));
			}

			Optional<Category> optionalCategory = categoryService
					.getCategoryById(updatedtransaction.getCategory().getId());
			Category category = optionalCategory.get();

			updatedtransaction.setCreatedUser(user);
			updatedtransaction.setCategory(category);
			updatedtransaction.setId(transactionId);
			Transaction savedTransaction = transactionService.addTransaction(updatedtransaction);
			return ResponseEntity.status(HttpStatus.OK).body(
					new SuccessResponse<Transaction>(true, Constants.OK, savedTransaction, HttpStatus.OK.value()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null));
		}
	}

	@GetMapping(Constants.ALL_TRANSACTIONS_ROUTE)
	public ResponseEntity<?> getTransactions(HttpServletRequest httpServletRequest, @RequestParam String search,
			@RequestParam String sortField, @RequestParam String sortOrder, @RequestParam String type,
			@RequestParam int limit) {
		try {
			if (!isAuthorized(httpServletRequest))
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new ErrorResponse(false, HttpStatus.UNAUTHORIZED.value(), Constants.NOT_AUTHORIZED, null));

			User user = userService.findByEmail(getEmail(httpServletRequest));

			List<Transaction> transactionsByCriteria = transactionService.getTransactions(user, limit, search,
					sortField, sortOrder, type);
			List<Transaction> transactions = transactionService.getTransactions(user, 0, search, sortField, sortOrder,
					type);
			boolean hasMoreTransactions = transactions.size() > transactionsByCriteria.size();
			return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<TransactionInfo>(true, Constants.OK,
					new TransactionInfo(transactionsByCriteria, hasMoreTransactions), HttpStatus.OK.value()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null));
		}
	}

	@GetMapping(Constants.GET_TRANSACTION_ROUTE)
	public ResponseEntity<?> getTransactionById(HttpServletRequest httpServletRequest,
			@PathVariable String transactionId) {
		try {
			if (!isAuthorized(httpServletRequest))
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new ErrorResponse(false, HttpStatus.UNAUTHORIZED.value(), Constants.NOT_AUTHORIZED, null));

			User user = userService.findByEmail(getEmail(httpServletRequest));
			Map<String, String> validationErrors = transactionValidator.validateGetTransaction(transactionId, user);
			if (!validationErrors.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(false,
						HttpStatus.BAD_REQUEST.value(), Constants.VALIDATION_FAILED, validationErrors));
			}

			return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<Transaction>(true, Constants.OK,
					transactionService.getTransactionById(transactionId).get(), HttpStatus.OK.value()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null));
		}
	}

	@DeleteMapping(Constants.DELETE_TRANSACTION_ROUTE)
	public ResponseEntity<?> deleteTransaction(HttpServletRequest httpServletRequest,
			@PathVariable String transactionId) {
		try {
			if (!isAuthorized(httpServletRequest))
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new ErrorResponse(false, HttpStatus.UNAUTHORIZED.value(), Constants.NOT_AUTHORIZED, null));

			User user = userService.findByEmail(getEmail(httpServletRequest));
			Map<String, String> validationErrors = transactionValidator.validateGetTransaction(transactionId, user);
			if (!validationErrors.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(false,
						HttpStatus.BAD_REQUEST.value(), Constants.VALIDATION_FAILED, validationErrors));
			}

			transactionService.deleteTransactionById(transactionId);
			return ResponseEntity.status(HttpStatus.OK)
					.body(new SuccessResponse<>(true, Constants.OK, null, HttpStatus.OK.value()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null));
		}
	}
}
