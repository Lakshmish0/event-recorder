package com.vbs.event_recorder.controller;

import com.vbs.event_recorder.dto.EventRequestDto;
import com.vbs.event_recorder.dto.EventResponseDto;
import com.vbs.event_recorder.dto.QuickStatsDto;
import com.vbs.event_recorder.model.EventCategory;
import com.vbs.event_recorder.service.EventBroadcaster;
import com.vbs.event_recorder.service.EventService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:4173", "http://localhost:5174", "https://lakshmish0.github.io"}, originPatterns = {"https://*.github.io"}, allowCredentials = "true")
public class EventController {

    private final EventService eventService;
    private final EventBroadcaster eventBroadcaster;

    public EventController(EventService eventService, EventBroadcaster eventBroadcaster) {
        this.eventService = eventService;
        this.eventBroadcaster = eventBroadcaster;
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamEvents(HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("X-Accel-Buffering", "no");
        response.setHeader("Connection", "keep-alive");
        return eventBroadcaster.createEmitter();
    }

    @PostMapping
    public ResponseEntity<EventResponseDto> createEvent(@Valid @RequestBody EventRequestDto dto) {
        EventResponseDto created = eventService.createEvent(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<EventResponseDto>> getAllEvents(
            @RequestParam(required = false) EventCategory category) {
        List<EventResponseDto> events = eventService.getAllEvents(category);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<EventResponseDto>> getEventsByMonth(
            @RequestParam int year,
            @RequestParam int month) {
        List<EventResponseDto> events = eventService.getEventsByMonth(year, month);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponseDto>> getUpcomingEvents(
            @RequestParam(defaultValue = "4") int limit) {
        List<EventResponseDto> events = eventService.getUpcomingEvents(limit);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/stats")
    public ResponseEntity<QuickStatsDto> getQuickStats() {
        QuickStatsDto stats = eventService.getQuickStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDto> getEventById(@PathVariable String id) {
        EventResponseDto event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDto> updateEvent(
            @PathVariable String id,
            @RequestBody EventRequestDto dto) {
        EventResponseDto updated = eventService.updateEvent(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}

