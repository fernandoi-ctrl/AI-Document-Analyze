package com.newcourse.randomjokes.RandomJokes.controllers;

import javax.validation.Valid;

import org.jboss.logging.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpServerErrorException.InternalServerError;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.http.HttpStatus;
import com.newcourse.randomjokes.RandomJokes.domain.Recipe;
import com.newcourse.randomjokes.RandomJokes.exceptions.NotFoundException;
import com.newcourse.randomjokes.RandomJokes.services.RecipeService;

@Controller
public class RecipeController {

	private static final Logger log = Logger.getLogger(RecipeController.class);
	private final RecipeService recipeService;
	
	public RecipeController(RecipeService recipeService) {
		this.recipeService=recipeService;
	}
	
	@RequestMapping("/recipe/show/{id}")
	public String showById(@PathVariable String id,Model model) {
		model.addAttribute("recipe",recipeService.findById(id));
		return "recipe/show";//68647b2cef20084068203a25
	}
	@GetMapping
	@RequestMapping("/recipe/new")
	public String newRecipe(Model model) {
		model.addAttribute("recipe",new Recipe());
		return "recipe/recipeForm";
	}
	@PostMapping
	@RequestMapping("/recipe/"/*,method = RequestMethod.POST*/)
	public String saveOrUpdate(@Valid @ModelAttribute Recipe recipe,BindingResult br) {
		
		if(br.hasErrors()) {
			
			return "recipe/recipeForm";
		}
		
		Recipe savedRecipe = recipeService.saveRecipe(recipe);
		
		return "redirect:/recipe/show/"+savedRecipe.getId();
	}
	@RequestMapping("/recipe/{id}/update")
	public String updateRecipe(@PathVariable String id,Model model) {
		model.addAttribute("recipe",recipeService.findById(id));
		return "recipe/recipeForm";
	}
	@GetMapping
	@RequestMapping("/recipe/{id}/delete")
	public String deleteRecipe(@PathVariable String id){
		recipeService.deleteRecipeById(id);
		return "redirect:/index";
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
	 @ResponseStatus(HttpStatus.BAD_REQUEST)
	    @ExceptionHandler(NumberFormatException.class)
	    public ModelAndView handleNumberFormatException(Exception e){

	        log.error("Handling not found exception");

	        ModelAndView modelAndView = new ModelAndView();

	        modelAndView.setViewName("400error");
	        modelAndView.addObject("exception",e);

	        return modelAndView;
	    }
	 @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	 @ExceptionHandler(InternalServerError.class)
	    public ModelAndView handle500Error(Exception e){

	        log.error("Handling not found exception");

	        ModelAndView modelAndView = new ModelAndView();

	        modelAndView.setViewName("500error");
	        modelAndView.addObject("exception",e);

	        return modelAndView;
	    }
	 @PostMapping
	 @RequestMapping(path="/recipe/add")
	 public String addRecipe(Model model) {
		 Recipe recipe = new Recipe();
		 recipeService.saveRecipe(recipe);
		 model.addAttribute("recipe",recipe);
		 return "recipe/recipeForm";
	 }
}
