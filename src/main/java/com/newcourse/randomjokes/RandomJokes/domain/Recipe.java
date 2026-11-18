package com.newcourse.randomjokes.RandomJokes.domain;



import java.nio.file.*;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;


/**
 * Created by jt on 6/13/17.
 */

@Document(collection = "recipe")
public class Recipe {
	
	
	
    @Id
    private String id;

    @SuppressWarnings("deprecation")
	@NotBlank
    @Size(min = 3,max = 255)
    private String description;
    
    @Min(1)
    @Max(999)
    private Integer prepTime;
    
    @Min(1)
    @Max(900)
    private Integer cookTime;
    private String servings;
    private String source;
    
    @URL
    private String url;

    @SuppressWarnings("deprecation")
    @NotBlank
    private String directions;

    private Set<Ingridient> ingridients = new HashSet<>();

    private Byte[] image;

    private Difficulty difficulty;

    private Notes notes;

    @DBRef
    private Set<Category> categories = new HashSet<>();

    public void setNotes(Notes notes) {
    	
        this.notes = notes;
        notes.setRecipe(this);
    }
public Recipe() {}
    public Recipe addIngridient(Ingridient ingredient){
        ingredient.setRecipe(this);
        this.ingridients.add(ingredient);
        return this;
    }

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

	public Integer getPrepTime() {
		return prepTime;
	}

	public void setPrepTime(Integer prepTime) {
		this.prepTime = prepTime;
	}

	public Integer getCookTime() {
		return cookTime;
	}

	public void setCookTime(Integer cookTime) {
		this.cookTime = cookTime;
	}

	public String getServings() {
		return servings;
	}

	public void setServings(String servings) {
		this.servings = servings;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getDirections() {
		return directions;
	}

	public void setDirections(String directions) {
		this.directions = directions;
	}

	public Set<Ingridient> getIngridients() {
		return ingridients;
	}

	public void setIngridients(Set<Ingridient> ingredients) {
		this.ingridients = ingredients;
	}

	public Byte[] getImage() {
		return image;
	}

	public void setImage(Byte[] image) {
		this.image = image;
	}

	public Difficulty getDifficulty() {
		return difficulty;
	}

	public void setDifficulty(Difficulty difficulty) {
		this.difficulty = difficulty;
	}

	public Set<Category> getCategories() {
		return categories;
	}

	public void setCategories(Set<Category> categories) {
		this.categories = categories;
	}

	public Notes getNotes() {
		return notes;
	}

	public Recipe(String id, String description, Integer prepTime, Integer cookTime, String servings, String source,
			String url, String directions, Set<Ingridient> ingredients, Byte[] image, Difficulty difficulty,
			Notes notes, Set<Category> categories) {
		this.id = id;
		this.description = description;
		this.prepTime = prepTime;
		this.cookTime = cookTime;
		this.servings = servings;
		this.source = source;
		this.url = url;
		this.directions = directions;
		this.ingridients = ingredients;
		this.image = image;
		this.difficulty = difficulty;
		this.notes = notes;
		this.categories = categories;
	}
	
	
    
}
