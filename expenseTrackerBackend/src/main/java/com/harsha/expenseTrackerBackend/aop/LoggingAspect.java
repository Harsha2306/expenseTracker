package com.harsha.expenseTrackerBackend.aop;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.JoinPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

	private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

	@Pointcut("execution(* com.harsha.expenseTrackerBackend.controller.*.*(..))")
	public void controllerMethods() {
	}

	// Before advice
	@Before("controllerMethods()")
	public void logBefore(JoinPoint joinPoint) {
		logger.info("Before execution: {}", joinPoint.getSignature());
	}

	// After returning advice
	@AfterReturning(pointcut = "controllerMethods()", returning = "result")
	public void logAfterReturning(JoinPoint joinPoint, Object result) {
		logger.info("After execution: {}", joinPoint.getSignature());
		if (result != null) {
			logger.info("Returned value: {}", result);
		}
	}

	// After throwing advice
	@AfterThrowing(pointcut = "controllerMethods()", throwing = "exception")
	public void logAfterThrowing(JoinPoint joinPoint, Throwable exception) {
		logger.error("Exception in: {}", joinPoint.getSignature());
		logger.error("Exception: {}", exception.getMessage(), exception);
	}
}
