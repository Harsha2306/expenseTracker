package com.harsha.expenseTrackerBackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.harsha.expenseTrackerBackend.model.Category;
import com.harsha.expenseTrackerBackend.repository.CategoryRepository;

@Service
@Transactional
public class CategoryService {

	@Autowired
	private CategoryRepository categoryRepository;

	public List<Category> getCategories() {
		return categoryRepository.findAll();
	}

	public List<Category> getCategoriesByType(String type) {
		return categoryRepository.findByType(type);
	}

	public Optional<Category> getCategoryById(String id) {
		return categoryRepository.findById(id);
	}
	
	public Category getCategoryByName(String name) {
		return categoryRepository.findByName(name);
	}
}
