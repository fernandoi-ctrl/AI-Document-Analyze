package com.newcourse.randomjokes.RandomJokes.controllers;

import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

import com.newcourse.randomjokes.RandomJokes.domain.Ingridient;
import com.newcourse.randomjokes.RandomJokes.domain.Recipe;
import com.newcourse.randomjokes.RandomJokes.exceptions.NotFoundException;
import com.newcourse.randomjokes.RandomJokes.services.*;

@Controller
public class IngredientController {
	private final Logger log = Logger.getLogger(IngredientController.class);
    private final RecipeService rs;
    private final IngredientService is;
    @Autowired
    public IngredientController(RecipeService rs,IngredientService is) {
    	this.rs=rs;
    	this.is=is;
    }
    
    
    @GetMapping
    @RequestMapping("/recipe/{recipeId}/ingredient/new")
    public String updateRecipeIngredient(@PathVariable String recipeId,
    		Model model) {
    	Recipe recipe = rs.findById(recipeId);
    	Ingridient ingredient = new Ingridient();
        ingredient.setRecipe(recipe);
        recipe.addIngridient(ingredient);
        is.saveIngredient(ingredient);
        rs.saveRecipe(recipe);
        
    	try {
    	System.out.println("vizualiza------------------ "+ingredient.getRecipe().getId()+ " " + ingredient.getId() +"-----------------");
    	}catch(Exception e) {
    		System.out.println("Error is here");
    	}
    	model.addAttribute("ingredient",ingredient);
    	
    	
    	return "recipe/ingredient/ingredient-form";
    	
    }
    
    @GetMapping
    @RequestMapping("/recipe/{recipeId}/ingredients")
    public String listIngredients(@PathVariable String recipeId,Model model) {
    	model.addAttribute("recipe",rs.findById(recipeId));
    	return "recipe/ingredient/list";
    }
    
    @GetMapping
    @RequestMapping("/recipe/{recipeId}/ingredient/{id}/show")
    public String showRecipeIngredient(@PathVariable String recipeId,@PathVariable String id,Model model) {
    	
    	model.addAttribute("ingredient",is.findByRecipeIdAndIngredientId(recipeId,id));
    	return "recipe/ingredient/show";
    }
    
    @PostMapping
    @RequestMapping(path="/recipe/{recipeId}/ingredient/{id}/update")
    public String updateRecipeIngredient(@PathVariable String recipeId,@PathVariable String id,Model model) {
    	model.addAttribute("ingredient",is.findByRecipeIdAndIngredientId(recipeId, id));
    	model.addAttribute("uomList",is.findByRecipeIdAndIngredientId(recipeId, id).getUom());
    	return "/recipe/ingredient/ingredient-form";
    }
    @PostMapping
    @RequestMapping("/recipe/{recipeId}/ingredient")
    public String saveOrUpdate(@PathVariable String recipeId,@ModelAttribute("ingredient")Ingridient ingredient) {
    	Recipe foundRecipe = rs.findById(recipeId); 
    	for(Ingridient i : foundRecipe.getIngridients()) {
    		if (i.getId()==ingredient.getId()) { 
    			i.setAmount(ingredient.getAmount());
    			i.setDescription(ingredient.getDescription());
    			i.setUom(ingredient.getUom());
    			System.out.println("Cambiando "+i.getId());
    			}
    		else {
    			System.out.println("viz didnt say a word "+i.getId() + " " +ingredient.getId());
    			}
    	}
    	
    	is.save(foundRecipe);
    	return "redirect:/recipe/"+recipeId+"/ingredients";
    }
    @RequestMapping("/recipe/{recipeId}/ingredient/{id}/delete")
    public String deleteIngredient(@PathVariable String recipeId,@PathVariable String id ) {
    	Recipe foundRecipe=rs.findById(recipeId);
    	Ingridient foundIngredient = foundRecipe.getIngridients()
    			.stream().filter(o->o.getId().equals(id)).findFirst().get();
//    	is.deleteIngredient(foundIngredient);
    	foundRecipe.getIngridients().remove(foundIngredient);
    	rs.saveRecipe(foundRecipe);
    	System.out.println("Eliminando");
    	is.deleteIngredient(foundIngredient);
    	return "redirect:/recipe/"+recipeId+"/ingredients";
    }
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NotFoundException.class)
    public ModelAndView handleNotFound(Exception e){

        log.error("Handling not found exception");

        ModelAndView modelAndView = new ModelAndView();

        modelAndView.setViewName("404error");
        modelAndView.addObject("exception",e);
        return modelAndView;
    }
}
