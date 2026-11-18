package com.newcourse.randomjokes.RandomJokes.repositorys;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;

import com.newcourse.randomjokes.RandomJokes.domain.*;


public interface RecipeRepository extends MongoRepository<Recipe,String>{
   public List<Recipe> findAll();
}
