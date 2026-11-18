package com.newcourse.randomjokes.RandomJokes.services;

import java.util.List;
import java.util.Optional;

import org.jboss.logging.Logger;
import org.springframework.stereotype.Service;

import com.newcourse.randomjokes.RandomJokes.domain.Ingridient;
import com.newcourse.randomjokes.RandomJokes.domain.Recipe;
import com.newcourse.randomjokes.RandomJokes.exceptions.NotFoundException;
import com.newcourse.randomjokes.RandomJokes.repositorys.IngredientRepository;
import com.newcourse.randomjokes.RandomJokes.repositorys.RecipeRepository;

import lombok.var;

@Service
public class IngredientServiceImpl implements IngredientService{

	private IngredientRepository ir;
	private static final Logger log= Logger.getLogger(IngredientServiceImpl.class);
			
	private RecipeRepository rr;
	
	public IngredientServiceImpl(IngredientRepository ir,RecipeRepository rr) {
		this.ir=ir;
		this.rr=rr;
	}
	
	@Override
	public List<Ingridient> findAll() {
		return ir.findAll();
	}

	@Override
	public Ingridient findByRecipeIdAndIngredientId(String recipeId,String id) {
		Optional<Recipe> recipeOpt = rr.findById(recipeId);
		if(recipeOpt.isEmpty()) {
			throw new NotFoundException("No id found");
		}
		log.getLogger("Imprimiendo lista...");
		Recipe recipe = recipeOpt.get();
//		recipe.getIngridients().forEach(System.out::println);
		
		Optional<Ingridient> ingredient = 
		recipe.getIngridients().stream()
		.filter(i->i.getId().equals(id)).findFirst();
		
		if(ingredient.isEmpty()) {
			throw new NotFoundException("No id found");
		}
		return ingredient.get();
		
	}

	@Override
	public Recipe save(Recipe recipe) {
	    recipe.getIngridients().forEach(o->{
	    	ir.save(o);
	    });
		return rr.save(recipe);
	}

	@Override
	public void deleteIngredient(Ingridient ingredient) {
		ir.delete(ingredient);
	}

	@Override
	public void saveIngredient(Ingridient ingredient) {
		ir.save(ingredient);
	}
   
} 
