package com.harsha.expenseTrackerBackend.util;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
	private boolean ok;
	private int statusCode;
    private String message;
    private Map<String, String> errors;
}
