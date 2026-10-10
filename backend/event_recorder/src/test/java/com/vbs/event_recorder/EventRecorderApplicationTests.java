package com.vbs.event_recorder;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "spring.data.mongodb.uri=mongodb://localhost:27017/test_db")
class EventRecorderApplicationTests {

	@Test
	void contextLoads() {
	}

}

