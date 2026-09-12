package com.vbs.event_recorder.repository;

import com.vbs.event_recorder.model.Event;
import com.vbs.event_recorder.model.EventCategory;
import com.vbs.event_recorder.model.EventStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {

    List<Event> findByCategory(EventCategory category);

    List<Event> findByStartDateTimeBetween(Instant start, Instant end);

    List<Event> findByCategoryAndStartDateTimeBetween(EventCategory category, Instant start, Instant end);

    List<Event> findByStartDateTimeGreaterThanEqualOrderByStartDateTimeAsc(Instant start, Pageable pageable);

    List<Event> findAllByOrderByStartDateTimeAsc();

    long countByStatus(EventStatus status);

    long countByStartDateTimeBetween(Instant start, Instant end);
}