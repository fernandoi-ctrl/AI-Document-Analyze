package com.newcourse.randomjokes.RandomJokes.repositorys;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;

import com.newcourse.randomjokes.RandomJokes.domain.Ingridient;

public interface IngredientRepository extends MongoRepository<Ingridient,String> {
   public List<Ingridient> findAll();
}
