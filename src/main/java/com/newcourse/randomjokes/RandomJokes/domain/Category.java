package com.newcourse.randomjokes.RandomJokes.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

/**
 * Created by jt on 6/13/17.
 */
//@Data
//@EqualsAndHashCode(exclude = {"recipes"})
@Document(collection = "category")
public class Category {

    @Id
    private String id;
    private String description;

   
    private Set<Recipe> recipes;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Set<Recipe> getRecipes() {
		return recipes;
	}

	public void setRecipes(Set<Recipe> recipes) {
		this.recipes = recipes;
	}

	public Category(String description) {
		this.description = description;
	}
    
    public Category() {}
    
}
