package com.harsha.expenseTrackerBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.harsha.expenseTrackerBackend.model.Budget;
import com.harsha.expenseTrackerBackend.model.User;
import com.harsha.expenseTrackerBackend.service.BudgetService;
import com.harsha.expenseTrackerBackend.service.UserService;
import com.harsha.expenseTrackerBackend.util.Constants;
import com.harsha.expenseTrackerBackend.util.DateUtil;
import com.harsha.expenseTrackerBackend.util.ErrorResponse;
import com.harsha.expenseTrackerBackend.util.SuccessResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@Transactional
@RequestMapping(Constants.USER_ROUTE)
public class BudgetController extends BaseController {

	@Autowired
	private UserService userService;
	@Autowired
	private BudgetService budgetService;
	@Autowired
	private DateUtil dateUtil;

	@PostMapping(Constants.NEW_BUDGET_ROUTE)
	public ResponseEntity<?> addBudget(HttpServletRequest httpServletRequest, @RequestBody Budget budget) {
		try {
			if (!isAuthorized(httpServletRequest))
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new ErrorResponse(false, HttpStatus.UNAUTHORIZED.value(), Constants.NOT_AUTHORIZED, null));

			User user = userService.findByEmail(getEmail(httpServletRequest));
			if (budget.getCreatedUser() == null) {
				budget.setCreatedUser(user);
			}
			
			Budget existingBudget = budgetService.getBudgetByForMonthAndUser(dateUtil.getCurrentMonthAndYear(), user);
			if (existingBudget != null)
				existingBudget.setLimit(budget.getLimit());

			Budget savedBudget = budgetService.createBudget(budget);
			return ResponseEntity.status(HttpStatus.OK)
					.body(new SuccessResponse<>(true, Constants.OK, savedBudget, HttpStatus.OK.value()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null));
		}
	}

	@GetMapping(Constants.GET_BUDGET_ROUTE)
	public ResponseEntity<?> getBudget(HttpServletRequest httpServletRequest) {
		try {
			if (!isAuthorized(httpServletRequest))
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new ErrorResponse(false, HttpStatus.UNAUTHORIZED.value(), Constants.NOT_AUTHORIZED, null));

			User user = userService.findByEmail(getEmail(httpServletRequest));
			Budget budget = budgetService.getBudgetByForMonthAndUser(dateUtil.getCurrentMonthAndYear(), user);

			return ResponseEntity.status(HttpStatus.OK)
					.body(new SuccessResponse<>(true, Constants.OK, budget, HttpStatus.OK.value()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null));
		}
	}

	@DeleteMapping(Constants.DELETE_BUDGET_ROUTE)
	public ResponseEntity<?> deleteBudget(HttpServletRequest httpServletRequest, @PathVariable String budgetId) {
		try {
			if (!isAuthorized(httpServletRequest))
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new ErrorResponse(false, HttpStatus.UNAUTHORIZED.value(), Constants.NOT_AUTHORIZED, null));

			budgetService.deleteBudget(budgetId);
			return ResponseEntity.status(HttpStatus.OK)
					.body(new SuccessResponse<>(true, Constants.OK, null, HttpStatus.OK.value()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null));
		}
	}
}
