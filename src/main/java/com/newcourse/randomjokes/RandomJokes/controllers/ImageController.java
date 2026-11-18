package com.newcourse.randomjokes.RandomJokes.controllers;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.jboss.logging.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.newcourse.randomjokes.RandomJokes.domain.Recipe;
import com.newcourse.randomjokes.RandomJokes.exceptions.NotFoundException;
import com.newcourse.randomjokes.RandomJokes.services.ImageService;
import com.newcourse.randomjokes.RandomJokes.services.RecipeService;

@Controller
public class ImageController {
    private final static Logger log = Logger.getLogger(ImageController.class);
	private final ImageService imageService;
	private final RecipeService rs;
	
	public ImageController(ImageService is,RecipeService rs) {
		this.imageService=is;
		this.rs=rs;
	}
	
	@GetMapping("recipe/{id}/image")
	public String showUploadForm(@PathVariable String id,Model model) {
		model.addAttribute("recipe",rs.findById(id));
		return "recipe/imageuploadform";
	}
	
	@PostMapping("recipe/{id}/image")
	public String handleImagePost(@PathVariable String id,@RequestParam("imagefile")MultipartFile img) {
		imageService.saveOrUpload(id,img);
		return "redirect:/recipe/show/"+id;
	}
	
	// Maneja solicitudes GET a la ruta /recipe/{id}/recipeimage
	@GetMapping("/recipe/{id}/recipeimage")
	public void getImageFromDB(@PathVariable String id, HttpServletResponse response) throws IOException {
		
	    // Busca una receta por su ID (convertido de String a Long)
	    Recipe r = rs.findById(id);

	    // Crea un nuevo arreglo de bytes primitivos con el mismo tamaño que el arreglo Byte[] de la imagen
	    byte[] byteArray = new byte[r.getImage().length];
	    int i = 0;

	    // Convierte cada objeto Byte (wrapper) del arreglo a su valor primitivo byte
	    for (Byte wrappedByte : r.getImage()) {
	        byteArray[i++] = wrappedByte;  // Copia cada byte en el nuevo arreglo
	    }

	    // Establece el tipo de contenido de la respuesta HTTP a imagen JPEG
	    response.setContentType("image/jpeg");

	    // Crea un flujo de entrada a partir del arreglo de bytes
	    InputStream is = new ByteArrayInputStream(byteArray);

	    // Copia el contenido del InputStream al OutputStream de la respuesta HTTP
	    IOUtils.copy(is, response.getOutputStream());

	    // NOTA: No es necesario cerrar manualmente los streams aquí, 
	    // porque el contenedor web (como Tomcat) se encarga del response.
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
