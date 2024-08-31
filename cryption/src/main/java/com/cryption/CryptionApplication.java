package com.cryption;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class CryptionApplication {

	public static void main(String[] args) {
		SpringApplication.run(CryptionApplication.class, args);
	}

	@RestController
	public class Test{

		@RequestMapping("/hi")
		public String m(){
			return "hi shravan";
		}
	}

}
