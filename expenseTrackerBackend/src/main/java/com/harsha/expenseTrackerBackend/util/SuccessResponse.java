package com.harsha.expenseTrackerBackend.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuccessResponse<T> {
	private boolean ok;
    private String message;
    private T data;
    private int statusCode;
}
