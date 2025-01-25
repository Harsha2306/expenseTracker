package com.harsha.expenseTrackerBackend.controller;

import com.harsha.expenseTrackerBackend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

public abstract class BaseController {

	protected String getEmail(HttpServletRequest httpServletRequest) {
		String authHeader = httpServletRequest.getHeader("Authorization");
		String token = authHeader.substring(7);
		String email = JwtUtil.extractUserEmail(token);
		httpServletRequest.setAttribute("email", email);
		return (String) httpServletRequest.getAttribute("email");
	}

	public boolean isAuthorized(HttpServletRequest httpServletRequest) {
		String authHeader = httpServletRequest.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			return JwtUtil.validateToken(token);
		} else {
			return false;
		}
	}
}
