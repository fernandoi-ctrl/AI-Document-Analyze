package com.newcourse.randomjokes.RandomJokes.services;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
//import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import com.newcourse.randomjokes.RandomJokes.domain.*;
import com.newcourse.randomjokes.RandomJokes.exceptions.NotFoundException;
import com.newcourse.randomjokes.RandomJokes.repositorys.RecipeRepository;

//
@Service
public class RecipeServiceImpl implements RecipeService {
	private static final Logger logger = Logger.getLogger(RecipeService.class.getName());
	private RecipeRepository rr;
	
	@Autowired
	public RecipeServiceImpl(RecipeRepository rr) {
		this.rr=rr;
	}
	
	public RecipeServiceImpl() {}
	
	@Override
	public Set<Recipe> getRecipes() {
		logger.info("Getting the recipes");
		   
		Set<Recipe> recipeSet = new HashSet<>();
		rr.findAll().iterator().forEachRemaining(recipeSet::add);
		return recipeSet;
	}

	@Override
	public Recipe findById(String id) {
		Optional<Recipe> foundrecipe = rr.findById(id);
		if(foundrecipe.isEmpty()) {
			throw new NotFoundException("No Id Found");
		}
	 	return foundrecipe.get();
	}

	@Override
	public Recipe saveRecipe(Recipe recipe) {
		return rr.save(recipe);
	}

	@Override
	public Recipe deleteRecipeById(String id) {
		Recipe foundRecipe = findById(id);
		rr.delete(foundRecipe);
		return foundRecipe;
	}
  
}
