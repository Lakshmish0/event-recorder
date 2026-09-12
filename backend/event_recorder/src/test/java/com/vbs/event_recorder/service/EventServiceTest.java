package com.vbs.event_recorder.service;

import com.vbs.event_recorder.dto.EventRequestDto;
import com.vbs.event_recorder.dto.EventResponseDto;
import com.vbs.event_recorder.dto.QuickStatsDto;
import com.vbs.event_recorder.exception.EventNotFoundException;
import com.vbs.event_recorder.model.Event;
import com.vbs.event_recorder.model.EventCategory;
import com.vbs.event_recorder.model.EventStatus;
import com.vbs.event_recorder.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    private Event sampleEvent;

    @BeforeEach
    void setUp() {
        sampleEvent = Event.builder()
                .id("evt-123")
                .title("Sunday Class")
                .category(EventCategory.CLASS)
                .startDateTime(Instant.parse("2026-09-06T09:00:00Z"))
                .endDateTime(Instant.parse("2026-09-06T11:30:00Z"))
                .location("VBS Classroom A")
                .description("Moral values class")
                .status(EventStatus.UPCOMING)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    @Test
    @DisplayName("createEvent should save and return EventResponseDto")
    void createEvent_Success() {
        EventRequestDto requestDto = EventRequestDto.builder()
                .title("Sunday Class")
                .category(EventCategory.CLASS)
                .startDate("2026-09-06")
                .startTime("09:00 AM")
                .endDate("2026-09-06")
                .endTime("11:30 AM")
                .location("VBS Classroom A")
                .notes("Moral values class")
                .build();

        when(eventRepository.save(any(Event.class))).thenReturn(sampleEvent);

        EventResponseDto result = eventService.createEvent(requestDto);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("evt-123");
        assertThat(result.getTitle()).isEqualTo("Sunday Class");
        assertThat(result.getCategory()).isEqualTo(EventCategory.CLASS);

        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    @DisplayName("getEventById should return event when found")
    void getEventById_Success() {
        when(eventRepository.findById("evt-123")).thenReturn(Optional.of(sampleEvent));

        EventResponseDto result = eventService.getEventById("evt-123");

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("evt-123");
        assertThat(result.getTitle()).isEqualTo("Sunday Class");
    }

    @Test
    @DisplayName("getEventById should throw EventNotFoundException when not found")
    void getEventById_NotFound() {
        when(eventRepository.findById("non-existent")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> eventService.getEventById("non-existent"))
                .isInstanceOf(EventNotFoundException.class)
                .hasMessageContaining("Event not found with id: non-existent");
    }

    @Test
    @DisplayName("getAllEvents should filter by category when category provided")
    void getAllEvents_WithCategory() {
        when(eventRepository.findByCategory(EventCategory.CLASS)).thenReturn(List.of(sampleEvent));

        List<EventResponseDto> result = eventService.getAllEvents(EventCategory.CLASS);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCategory()).isEqualTo(EventCategory.CLASS);
        verify(eventRepository, times(1)).findByCategory(EventCategory.CLASS);
    }

    @Test
    @DisplayName("getEventsByMonth should query date range")
    void getEventsByMonth_Success() {
        when(eventRepository.findByStartDateTimeBetween(any(Instant.class), any(Instant.class)))
                .thenReturn(List.of(sampleEvent));

        List<EventResponseDto> result = eventService.getEventsByMonth(2026, 9);

        assertThat(result).hasSize(1);
        verify(eventRepository, times(1)).findByStartDateTimeBetween(any(Instant.class), any(Instant.class));
    }

    @Test
    @DisplayName("getQuickStats should calculate correct metrics")
    void getQuickStats_Success() {
        Event completed = Event.builder()
                .id("evt-1")
                .title("Past Event")
                .category(EventCategory.CAMP)
                .startDateTime(Instant.parse("2026-08-01T09:00:00Z"))
                .endDateTime(Instant.parse("2026-08-01T17:00:00Z"))
                .status(EventStatus.COMPLETED)
                .build();

        when(eventRepository.findAll()).thenReturn(List.of(sampleEvent, completed));

        QuickStatsDto stats = eventService.getQuickStats();

        assertThat(stats).isNotNull();
        assertThat(stats.getTotalEvents()).isEqualTo(2);
        assertThat(stats.getCompleted()).isGreaterThanOrEqualTo(1);
    }

    @Test
    @DisplayName("updateEvent should update existing event details")
    void updateEvent_Success() {
        EventRequestDto updateDto = EventRequestDto.builder()
                .title("Updated Sunday Class")
                .build();

        when(eventRepository.findById("evt-123")).thenReturn(Optional.of(sampleEvent));
        when(eventRepository.save(any(Event.class))).thenReturn(sampleEvent);

        EventResponseDto result = eventService.updateEvent("evt-123", updateDto);

        assertThat(result).isNotNull();
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    @DisplayName("deleteEvent should throw exception when id not found")
    void deleteEvent_NotFound() {
        when(eventRepository.existsById("invalid-id")).thenReturn(false);

        assertThatThrownBy(() -> eventService.deleteEvent("invalid-id"))
                .isInstanceOf(EventNotFoundException.class);
    }

    @Test
    @DisplayName("deleteEvent should delete when id exists")
    void deleteEvent_Success() {
        when(eventRepository.existsById("evt-123")).thenReturn(true);

        eventService.deleteEvent("evt-123");

        verify(eventRepository, times(1)).deleteById("evt-123");
    }
}
