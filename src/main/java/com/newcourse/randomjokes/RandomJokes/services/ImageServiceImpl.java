package com.newcourse.randomjokes.RandomJokes.services;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.newcourse.randomjokes.RandomJokes.domain.Recipe;

@Service
public class ImageServiceImpl implements ImageService {

	private RecipeService rs;
	
	public ImageServiceImpl(RecipeService rs) {
		this.rs=rs;
	}
	
	@Override
	public void saveOrUpload(String recipeid, MultipartFile file) {
		
		Recipe recipe = rs.findById(recipeid);
		
		try {
		Byte[] bytes = new Byte[file.getBytes().length];
		
		int i=0;
		for(byte b:file.getBytes()) {
			bytes[i++] = b;
		}
		recipe.setImage(bytes);
		rs.saveRecipe(recipe);
		}catch(IOException e) {
			System.err.println(e.getMessage());
		}
		
	}

}
