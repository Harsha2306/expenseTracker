package com.harsha.expenseTrackerBackend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.harsha.expenseTrackerBackend.model.Category;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
	public List<Category> findByType(String type);

	public Category findByName(String name);
}
