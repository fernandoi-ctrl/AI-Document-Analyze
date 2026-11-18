package com.newcourse.randomjokes.RandomJokes.services;

import java.util.Set;
import com.newcourse.randomjokes.RandomJokes.domain.*;



public interface RecipeService {
    public Set<Recipe> getRecipes();
    
    Recipe findById(String id);
    
    public Recipe saveRecipe(Recipe recipe);
    
    public Recipe deleteRecipeById(String id);
}
