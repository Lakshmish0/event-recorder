package com.vbs.event_recorder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EventRecorderApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventRecorderApplication.class, args);
	}

}

