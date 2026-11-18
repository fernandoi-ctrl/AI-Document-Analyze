package com.newcourse.randomjokes.RandomJokes.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Objects;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Created by jt on 6/13/17.
 */

//@EqualsAndHashCode(exclude = {"recipe"})
@Document(collection = "notes")
public class Notes {

    @Id
    private String id;

    @Transient
    private Recipe recipe;

    
    private String recipeNotes;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Recipe getRecipe() {
		return recipe;
	}

	public void setRecipe(Recipe recipe) {
		this.recipe = recipe;
	}

	public String getRecipeNotes() {
		return recipeNotes;
	}

	public void setRecipeNotes(String recipeNotes) {
		this.recipeNotes = recipeNotes;
	}

	@Override
	public String toString() {
		return "Notes [id=" + id + ", recipe=" + recipe + ", recipeNotes=" + recipeNotes + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Notes other = (Notes) obj;
		return Objects.equals(id, other.id);
	}

    
    
}