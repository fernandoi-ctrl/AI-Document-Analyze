package com.newcourse.randomjokes.RandomJokes.services;

import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
   void saveOrUpload(String recipeid,MultipartFile file);
}
