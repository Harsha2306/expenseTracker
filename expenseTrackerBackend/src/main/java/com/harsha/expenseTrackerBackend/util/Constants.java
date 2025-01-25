package com.harsha.expenseTrackerBackend.util;

public class Constants {

	public static final String DUPLICATE_EMAIL = "The email address is already registered. Please use a different email.";

	public static final String CREATED = "created";

	public static final String VALIDATION_FAILED = "Validation failed";

	public static final String REMOVED = "removed";

	public static final String CATEGORY_NAME_REQ_VALIDATION_MSG = "Category name is required";

	public static final String CATEGORY_TYPE_REQ_VALIDATION_MSG = "Category type is required";

	public static final String CATEGORY_TYPE__EQUALITY_VALIDATION_MSG = "Category type must be 'expense' or 'income'";

	public static final String CATEGORY_ICON_REQ__VALIDATION_MSG = "Category icon path is required";
	
	public static final String CATEGORY_OTHERS = "Others";

	public static final String CATEGORY_NAME = "name";

	public static final String CATEGORY_TYPE = "type";

	public static final String CATEGORY_ICON_PATH = "icon path";

	public static final String EXPENSE = "expense";

	public static final String USER_FULLNAME = "fullName";

	public static final String USER_EMAIL = "email";

	public static final String USER_PASSWORD = "password";

	public static final String USER_FULLNAME_REQ_VALIDATION_MSG = "Full name is required";

	public static final String USER_EMAIL_REQ_VALIDATION_MSG = "Email is required";

	public static final String USER_EMAIL_REG_EXP = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

	public static final String USER_EMAIL_INVALID_VALIDATION_MSG = "Invalid email format";

	public static final String USER_PASSWORD_REQ_VALIDATION_MSG = "Password is required";

	public static final String USER_PASSWORD_REG_EXP = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\[\\]{};':\"\\\\|,.<>/?\\-]).{8,}$";

	public static final String USER_PASSWORD_REG_EXP_VALIDATION_MSG = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";

	public static final String TRANSACTION_AMOUNT_REQ_VALIDATION_MSG = "amouont is required";

	public static final String TRANSACTION_AMOUNT_NEG_VALIDATION_MSG = "amouont can't be negetive";

	public static final String TRANSACTION_AMOUNT = "amount";

	public static final String TRANSACTION_DATE = "date";

	public static final String TRANSACTION_DATE_REQ_VALIDATION_MSG = "date is required";

	public static final String TRANSACTION_TYPE = "income";

	public static final String TRANSACTION_TYPE_REQ_VALIDATION_MSG = "income";

	public static final String INCOME = "income";

	public static final String USER_NOT_FOUND = "user not found";

	public static final String SIGNUP_ROUTE = "/signup";

	public static final String LOGIN_ROUTE = "/login";

	public static final String OK = "ok";

	public static final String PLEASE_CHECK_YOUR_PASSWORD = "please check your password";

	public static final String INVALID_CREDENTIALS = "Invalid credentials";

	public static final String DASHBOARD_ROUTE = "/dashboard";

	public static final String CATEGORIES_ROUTE = "/categories";

	public static final String NEW_BUDGET_ROUTE = "/newBudget";

	public static final String EDIT_BUDGET_ROUTE = "/editBudget";

	public static final String DELETE_BUDGET_ROUTE = "/deleteBudget/{budgetId}";

	public static final String GET_BUDGET_ROUTE = "/getBudget";

	public static final String NEW_TRANSACTION_ROUTE = "/newTransaction";

	public static final String EDIT_TRANSACTION_ROUTE = "/editTransaction/{transactionId}";

	public static final String GET_TRANSACTION_ROUTE = "/transaction/{transactionId}";

	public static final String DELETE_TRANSACTION_ROUTE = "/deleteTransaction/{transactionId}";

	public static final String ALL_TRANSACTIONS_ROUTE = "/allTransactions";

	public static final String USER_ROUTE = "/user";

	public static final String AUTH_ROUTE = "/api/auth";

	public static final String ASC = "asc";
	
	public static final String DSC = "dsc";
	
	public static final String ALL = "all";
	
	public static final String DATE = "date";
	
	public static final String NOT_AUTHORIZED = "not authorized";
}
