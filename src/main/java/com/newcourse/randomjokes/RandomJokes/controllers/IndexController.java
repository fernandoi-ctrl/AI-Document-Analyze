package com.newcourse.randomjokes.RandomJokes.controllers;

import java.util.List;
import java.util.Optional;

import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.newcourse.randomjokes.RandomJokes.domain.*;
import com.newcourse.randomjokes.RandomJokes.repositorys.*;
import com.newcourse.randomjokes.RandomJokes.services.RecipeService;

@Controller
public class IndexController {

	private static final Logger log = Logger.getLogger(RecipeController.class);
	private CategoryRepository categoryRepository;
	private UnitOfMeasureRepository unitOfMeasureRepository;
	private RecipeRepository recipeRepository;
	
	@Autowired
	public IndexController(RecipeRepository rr, CategoryRepository cr,UnitOfMeasureRepository uomr) {
		this.categoryRepository=cr;
		this.unitOfMeasureRepository=uomr;
		this.recipeRepository=rr;
	}
	
	public IndexController(RecipeService recipeService) {
//         recipeService;
	}

	@RequestMapping({"","/","/index"})
	public String getIndexPage(Model model) {
//		Optional<Category> categoryOptional = categoryRepository.findByDescription("American");
//		Optional<UnitOfMeasure> unitOfMeasureOptional = unitOfMeasureRepository.findByDescription("Teaspoon");
//		System.out.println("Category id: "+categoryOptional.get().getId());
//		System.out.println("Unit Of Measure id: "+categoryOptional.get().getId());
		
		List<Recipe> recipes = recipeRepository.findAll();
//		recipes.forEach(System.out::println);
		log.info("Entering the index");
		model.addAttribute("recipes",recipes);
		
		return "index";
	}
	
}
