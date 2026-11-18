package com.newcourse.randomjokes.RandomJokes.services;

import java.util.List;

import com.newcourse.randomjokes.RandomJokes.domain.Ingridient;
import com.newcourse.randomjokes.RandomJokes.domain.Recipe;

public interface IngredientService {
    public List<Ingridient> findAll();
    public Ingridient findByRecipeIdAndIngredientId(String recipeId,String id);
    public Recipe save(Recipe recipe);
    public void deleteIngredient(Ingridient ingredient);
    public void saveIngredient(Ingridient ingredient);
}
