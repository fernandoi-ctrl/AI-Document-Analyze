package com.newcourse.randomjokes.RandomJokes.repositorys;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;

import com.newcourse.randomjokes.RandomJokes.domain.*;


public interface UnitOfMeasureRepository extends MongoRepository<UnitOfMeasure,String> {
	
	Optional<UnitOfMeasure> findByDescription(String description);
	
	Optional<UnitOfMeasure> findFirstByDescription(String description);	
	
	List<UnitOfMeasure> findAllByDescription(String description);	
}
