package com.vbs.event_recorder.service;

import com.vbs.event_recorder.dto.EventRequestDto;
import com.vbs.event_recorder.dto.EventResponseDto;
import com.vbs.event_recorder.dto.QuickStatsDto;
import com.vbs.event_recorder.exception.EventNotFoundException;
import com.vbs.event_recorder.model.Event;
import com.vbs.event_recorder.model.EventCategory;
import com.vbs.event_recorder.model.EventStatus;
import com.vbs.event_recorder.repository.EventRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public EventResponseDto createEvent(EventRequestDto dto) {
        Instant start = dto.resolveStartDateTime();
        Instant end = dto.resolveEndDateTime();
        String desc = dto.resolveDescription();

        EventStatus status = dto.getStatus();
        if (status == null) {
            status = deriveStatus(start, end);
        }

        Event event = Event.builder()
                .title(dto.getTitle())
                .category(dto.getCategory())
                .startDateTime(start)
                .endDateTime(end)
                .location(dto.getLocation())
                .description(desc)
                .imageUrl(dto.getImageUrl())
                .status(status)
                .build();

        Event saved = eventRepository.save(event);
        return EventResponseDto.fromEntity(saved);
    }

    public List<EventResponseDto> getAllEvents(EventCategory category) {
        List<Event> events;
        if (category != null) {
            events = eventRepository.findByCategory(category);
        } else {
            events = eventRepository.findAllByOrderByStartDateTimeAsc();
        }
        return events.stream()
                .map(EventResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public EventResponseDto getEventById(String id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException(id));
        return EventResponseDto.fromEntity(event);
    }

    public List<EventResponseDto> getEventsByMonth(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        ZonedDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay(ZoneId.of("UTC"));
        ZonedDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59, 999_999_999).atZone(ZoneId.of("UTC"));

        List<Event> events = eventRepository.findByStartDateTimeBetween(
                startOfMonth.toInstant(),
                endOfMonth.toInstant()
        );

        return events.stream()
                .map(EventResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<EventResponseDto> getUpcomingEvents(int limit) {
        int maxLimit = limit > 0 ? limit : 4;
        Instant now = Instant.now();
        List<Event> events = eventRepository.findByStartDateTimeGreaterThanEqualOrderByStartDateTimeAsc(
                now,
                PageRequest.of(0, maxLimit)
        );

        // If not enough future startDateTime events found, fetch all events sorted by startDateTime
        if (events.size() < maxLimit) {
            events = eventRepository.findAllByOrderByStartDateTimeAsc();
            if (events.size() > maxLimit) {
                events = events.subList(0, maxLimit);
            }
        }

        return events.stream()
                .map(EventResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public QuickStatsDto getQuickStats() {
        List<Event> allEvents = eventRepository.findAll();
        long totalEvents = allEvents.size();

        ZoneId utc = ZoneId.of("UTC");
        ZonedDateTime now = ZonedDateTime.now(utc);
        int currentYear = now.getYear();
        int currentMonth = now.getMonthValue();

        long thisMonthCount = allEvents.stream()
                .filter(e -> {
                    if (e.getStartDateTime() == null) return false;
                    ZonedDateTime zdt = e.getStartDateTime().atZone(utc);
                    return zdt.getYear() == currentYear && zdt.getMonthValue() == currentMonth;
                })
                .count();

        long upcomingCount = allEvents.stream()
                .filter(e -> e.getStatus() == EventStatus.UPCOMING || e.getStatus() == EventStatus.LATER || (e.getStartDateTime() != null && e.getStartDateTime().isAfter(now.toInstant())))
                .count();

        long completedCount = allEvents.stream()
                .filter(e -> e.getStatus() == EventStatus.COMPLETED || (e.getEndDateTime() != null && e.getEndDateTime().isBefore(now.toInstant())))
                .count();

        return QuickStatsDto.builder()
                .totalEvents(totalEvents)
                .thisMonth(thisMonthCount)
                .upcoming(upcomingCount)
                .completed(completedCount)
                .build();
    }

    public EventResponseDto updateEvent(String id, EventRequestDto dto) {
        Event existing = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException(id));

        if (dto.getTitle() != null && !dto.getTitle().isBlank()) {
            existing.setTitle(dto.getTitle());
        }
        if (dto.getCategory() != null) {
            existing.setCategory(dto.getCategory());
        }
        if (dto.getStartDateTime() != null || (dto.getStartDate() != null && !dto.getStartDate().isBlank())) {
            existing.setStartDateTime(dto.resolveStartDateTime());
        }
        if (dto.getEndDateTime() != null || (dto.getEndDate() != null && !dto.getEndDate().isBlank())) {
            existing.setEndDateTime(dto.resolveEndDateTime());
        }
        if (dto.getLocation() != null) {
            existing.setLocation(dto.getLocation());
        }
        String desc = dto.resolveDescription();
        if (!desc.isBlank()) {
            existing.setDescription(desc);
        }
        if (dto.getImageUrl() != null) {
            existing.setImageUrl(dto.getImageUrl());
        }
        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        } else {
            existing.setStatus(deriveStatus(existing.getStartDateTime(), existing.getEndDateTime()));
        }

        Event updated = eventRepository.save(existing);
        return EventResponseDto.fromEntity(updated);
    }

    public void deleteEvent(String id) {
        if (!eventRepository.existsById(id)) {
            throw new EventNotFoundException(id);
        }
        eventRepository.deleteById(id);
    }

    private EventStatus deriveStatus(Instant start, Instant end) {
        Instant now = Instant.now();
        if (end != null && now.isAfter(end)) {
            return EventStatus.COMPLETED;
        }
        if (start != null && (now.isAfter(start) || now.equals(start))) {
            return EventStatus.ONGOING;
        }
        return EventStatus.UPCOMING;
    }
}