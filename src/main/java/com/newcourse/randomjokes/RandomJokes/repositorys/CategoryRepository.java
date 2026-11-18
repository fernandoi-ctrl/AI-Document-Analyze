package com.newcourse.randomjokes.RandomJokes.repositorys;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;

import com.newcourse.randomjokes.RandomJokes.domain.*;


public interface CategoryRepository extends MongoRepository<Category,String>{
	
	Optional<Category> findByDescription(String description);
	List<Category> findAllByDescription(String description);	

}
