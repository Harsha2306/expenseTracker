package com.harsha.expenseTrackerBackend.validators;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.harsha.expenseTrackerBackend.util.AuthRequest;
import com.harsha.expenseTrackerBackend.util.Constants;

@Component
public class LoginValidator {

	public Map<String, String> validateLoginCredentials(AuthRequest authRequest) {
		Map<String, String> errors = new HashMap<>();

		if (authRequest.getEmail() == null || authRequest.getEmail().trim().isEmpty()) {
			errors.put(Constants.USER_EMAIL, Constants.USER_EMAIL_REQ_VALIDATION_MSG);
		} else if (!authRequest.getEmail().matches(Constants.USER_EMAIL_REG_EXP)) {
			errors.put(Constants.USER_EMAIL, Constants.USER_EMAIL_INVALID_VALIDATION_MSG);
		}

		if (authRequest.getPassword() == null || authRequest.getPassword().trim().isEmpty()) {
			errors.put(Constants.USER_PASSWORD, Constants.USER_PASSWORD_REQ_VALIDATION_MSG);
		} else if (!authRequest.getPassword().matches(Constants.USER_PASSWORD_REG_EXP)) {
			errors.put(Constants.USER_PASSWORD, Constants.USER_PASSWORD_REG_EXP_VALIDATION_MSG);
		}

		return errors;
	}

}

