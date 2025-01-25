package com.harsha.expenseTrackerBackend.validators;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.harsha.expenseTrackerBackend.model.User;
import com.harsha.expenseTrackerBackend.service.UserService;
import com.harsha.expenseTrackerBackend.util.Constants;

@Component
public class UserValidator {

	@Autowired
	private UserService userService;

	public Map<String, String> validateUser(User user) {
		Map<String, String> errors = new HashMap<>();

		if (user.getFullName() == null || user.getFullName().trim().isEmpty()) {
			errors.put(Constants.USER_FULLNAME, Constants.USER_FULLNAME_REQ_VALIDATION_MSG);
		}

		if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
			errors.put(Constants.USER_EMAIL, Constants.USER_EMAIL_REQ_VALIDATION_MSG);
		} else if (!user.getEmail().matches(Constants.USER_EMAIL_REG_EXP)) {
			errors.put(Constants.USER_EMAIL, Constants.USER_EMAIL_INVALID_VALIDATION_MSG);
		}

		if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
			errors.put(Constants.USER_PASSWORD, Constants.USER_PASSWORD_REQ_VALIDATION_MSG);
		} else if (!user.getPassword().matches(Constants.USER_PASSWORD_REG_EXP)) {
			errors.put(Constants.USER_PASSWORD, Constants.USER_PASSWORD_REG_EXP_VALIDATION_MSG);
		}

		User userAlreadyExists = userService.findByEmail(user.getEmail());
		if (userAlreadyExists != null)
			errors.put(Constants.USER_EMAIL, Constants.DUPLICATE_EMAIL);

		return errors;
	}

}
