package com.harsha.expenseTrackerBackend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.harsha.expenseTrackerBackend.model.User;
import com.harsha.expenseTrackerBackend.service.UserService;
import com.harsha.expenseTrackerBackend.util.AuthRequest;
import com.harsha.expenseTrackerBackend.util.Constants;
import com.harsha.expenseTrackerBackend.util.ErrorResponse;
import com.harsha.expenseTrackerBackend.util.JwtUtil;
import com.harsha.expenseTrackerBackend.util.PasswordUtil;
import com.harsha.expenseTrackerBackend.util.SuccessResponse;
import com.harsha.expenseTrackerBackend.validators.LoginValidator;
import com.harsha.expenseTrackerBackend.validators.UserValidator;

@RestController
@Transactional
@RequestMapping(Constants.AUTH_ROUTE)
public class AuthController {
	@Autowired
	private UserService userService;
	@Autowired
	private UserValidator userValidator;
	@Autowired
	private LoginValidator loginValidator;

	@PostMapping(Constants.SIGNUP_ROUTE)
	public ResponseEntity<?> registerUser(@RequestBody User user) {
		try {
			Map<String, String> validationErrors = userValidator.validateUser(user);
			if (!validationErrors.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(false,
						HttpStatus.BAD_REQUEST.value(), Constants.VALIDATION_FAILED, validationErrors));
			}

			userService.addUser(user);
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(new SuccessResponse<>(true, Constants.CREATED, null, HttpStatus.OK.value()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null));
		}
	}

	@PostMapping(Constants.LOGIN_ROUTE)
	public ResponseEntity<?> loginUser(@RequestBody AuthRequest authRequest) {
		try {
			Map<String, String> validationErrors = loginValidator.validateLoginCredentials(authRequest);
			if (!validationErrors.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(false,
						HttpStatus.BAD_REQUEST.value(), Constants.VALIDATION_FAILED, validationErrors));
			}

			User user = userService.findByEmail(authRequest.getEmail());
			if (user == null) {
				validationErrors.put(Constants.USER_EMAIL, Constants.USER_NOT_FOUND);
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(false,
						HttpStatus.UNAUTHORIZED.value(), Constants.INVALID_CREDENTIALS, validationErrors));
			}

			if (!PasswordUtil.matches(authRequest.getPassword(), user.getPassword())) {
				validationErrors.put(Constants.USER_PASSWORD, Constants.PLEASE_CHECK_YOUR_PASSWORD);
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(false,
						HttpStatus.UNAUTHORIZED.value(), Constants.INVALID_CREDENTIALS, validationErrors));
			}

			String token = JwtUtil.generateToken(user.getEmail());

			return ResponseEntity.status(HttpStatus.OK)
					.body(new SuccessResponse<>(true, Constants.OK, token, HttpStatus.OK.value()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null));
		}
	}

}
