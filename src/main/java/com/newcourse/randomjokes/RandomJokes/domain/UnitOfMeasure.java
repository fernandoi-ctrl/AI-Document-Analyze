package com.newcourse.randomjokes.RandomJokes.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;


/**
 * Created by jt on 6/13/17.
 */
@Data
@Document(collection = "unitOfMeasure")
public class UnitOfMeasure {

    @Id
    private String id;
    private String description;
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
	public UnitOfMeasure(String description) {
		this.description = description;
	}
    
    public UnitOfMeasure() {}
	@Override
	public String toString() {
		return "UnitOfMeasure [id=" + id + ", description=" + description + "]";
	}
	
    
}
