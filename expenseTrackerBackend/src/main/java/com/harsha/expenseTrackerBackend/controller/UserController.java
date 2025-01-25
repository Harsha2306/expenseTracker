package com.harsha.expenseTrackerBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.harsha.expenseTrackerBackend.model.Category;
import com.harsha.expenseTrackerBackend.service.CategoryService;
import com.harsha.expenseTrackerBackend.service.UserService;
import com.harsha.expenseTrackerBackend.util.Categories;
import com.harsha.expenseTrackerBackend.util.Constants;
import com.harsha.expenseTrackerBackend.util.Dashboard;
import com.harsha.expenseTrackerBackend.util.ErrorResponse;
import com.harsha.expenseTrackerBackend.util.SuccessResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@Transactional
@RequestMapping(Constants.USER_ROUTE)
public class UserController extends BaseController {

	@Autowired
	private UserService userService;
	@Autowired
	private CategoryService categoryService;

	@GetMapping(Constants.DASHBOARD_ROUTE)
	public ResponseEntity<?> getDashboard(HttpServletRequest httpServletRequest) {
		try {
			if (!isAuthorized(httpServletRequest))
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new ErrorResponse(false, HttpStatus.UNAUTHORIZED.value(), Constants.NOT_AUTHORIZED, null));
			String email = getEmail(httpServletRequest);
			Dashboard dashboard = userService.getUserDashboardByEmail(email);
			return ResponseEntity.status(HttpStatus.OK)
					.body(new SuccessResponse<>(true, Constants.OK, dashboard, HttpStatus.OK.value()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null));
		}
	}

	@GetMapping(Constants.CATEGORIES_ROUTE)
	public ResponseEntity<?> getCategories(HttpServletRequest httpServletRequest) {
		try {
			if (!isAuthorized(httpServletRequest))
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new ErrorResponse(false, HttpStatus.UNAUTHORIZED.value(), Constants.NOT_AUTHORIZED, null));
			List<Category> income = categoryService.getCategoriesByType(Constants.INCOME);
			List<Category> expense = categoryService.getCategoriesByType(Constants.EXPENSE);
			Category othersCategory = categoryService.getCategoryByName(Constants.CATEGORY_OTHERS);
			income.add(othersCategory);
			expense.add(othersCategory);
			return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<Categories>(true, Constants.OK,
					new Categories(income, expense), HttpStatus.OK.value()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null));
		}
	}

}
