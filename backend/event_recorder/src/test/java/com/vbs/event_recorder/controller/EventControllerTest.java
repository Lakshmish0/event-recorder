package com.vbs.event_recorder.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.vbs.event_recorder.dto.EventRequestDto;
import com.vbs.event_recorder.dto.EventResponseDto;
import com.vbs.event_recorder.dto.QuickStatsDto;
import com.vbs.event_recorder.exception.EventNotFoundException;
import com.vbs.event_recorder.model.EventCategory;
import com.vbs.event_recorder.model.EventStatus;
import com.vbs.event_recorder.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EventController.class)
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService eventService;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    private EventResponseDto responseDto;

    @BeforeEach
    void setUp() {
        responseDto = EventResponseDto.builder()
                .id("evt-1")
                .title("Special Event")
                .category(EventCategory.SPECIAL_EVENT)
                .startDateTime(Instant.parse("2026-09-12T10:00:00Z"))
                .endDateTime(Instant.parse("2026-09-12T13:00:00Z"))
                .startDate("2026-09-12")
                .endDate("2026-09-12")
                .startTime("10:00 AM")
                .endTime("01:00 PM")
                .location("Heritage Hall")
                .description("Special guest lecture")
                .notes("Special guest lecture")
                .status(EventStatus.UPCOMING)
                .build();
    }

    @Test
    @DisplayName("POST /api/events creates event and returns 201 CREATED")
    void createEvent_Returns201() throws Exception {
        EventRequestDto requestDto = EventRequestDto.builder()
                .title("Special Event")
                .category(EventCategory.SPECIAL_EVENT)
                .startDate("2026-09-12")
                .startTime("10:00 AM")
                .endDate("2026-09-12")
                .endTime("01:00 PM")
                .location("Heritage Hall")
                .notes("Special guest lecture")
                .build();

        when(eventService.createEvent(any(EventRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("evt-1"))
                .andExpect(jsonPath("$.title").value("Special Event"))
                .andExpect(jsonPath("$.category").value("Special Event"));
    }

    @Test
    @DisplayName("POST /api/events returns 400 BAD REQUEST when title is missing")
    void createEvent_ValidationFailure() throws Exception {
        EventRequestDto invalidDto = EventRequestDto.builder()
                .title("") // Blank title fails @NotBlank
                .category(EventCategory.CLASS)
                .build();

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @DisplayName("GET /api/events returns event list and 200 OK")
    void getAllEvents_Returns200() throws Exception {
        when(eventService.getAllEvents(null)).thenReturn(List.of(responseDto));

        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("evt-1"))
                .andExpect(jsonPath("$[0].title").value("Special Event"));
    }

    @Test
    @DisplayName("GET /api/events/{id} returns single event")
    void getEventById_Returns200() throws Exception {
        when(eventService.getEventById("evt-1")).thenReturn(responseDto);

        mockMvc.perform(get("/api/events/evt-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("evt-1"));
    }

    @Test
    @DisplayName("GET /api/events/{id} returns 404 NOT FOUND when missing")
    void getEventById_Returns404() throws Exception {
        when(eventService.getEventById("unknown")).thenThrow(new EventNotFoundException("unknown"));

        mockMvc.perform(get("/api/events/unknown"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Event not found with id: unknown"));
    }

    @Test
    @DisplayName("GET /api/events/calendar returns events for month")
    void getEventsByMonth_Returns200() throws Exception {
        when(eventService.getEventsByMonth(2026, 9)).thenReturn(List.of(responseDto));

        mockMvc.perform(get("/api/events/calendar?year=2026&month=9"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("evt-1"));
    }

    @Test
    @DisplayName("GET /api/events/upcoming returns upcoming events")
    void getUpcomingEvents_Returns200() throws Exception {
        when(eventService.getUpcomingEvents(4)).thenReturn(List.of(responseDto));

        mockMvc.perform(get("/api/events/upcoming?limit=4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("evt-1"));
    }

    @Test
    @DisplayName("GET /api/events/stats returns QuickStats")
    void getQuickStats_Returns200() throws Exception {
        QuickStatsDto stats = QuickStatsDto.builder()
                .totalEvents(10)
                .thisMonth(5)
                .upcoming(4)
                .completed(1)
                .build();

        when(eventService.getQuickStats()).thenReturn(stats);

        mockMvc.perform(get("/api/events/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalEvents").value(10))
                .andExpect(jsonPath("$.thisMonth").value(5));
    }

    @Test
    @DisplayName("PUT /api/events/{id} updates event")
    void updateEvent_Returns200() throws Exception {
        EventRequestDto updateDto = EventRequestDto.builder()
                .title("Updated Special Event")
                .build();

        when(eventService.updateEvent(eq("evt-1"), any(EventRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(put("/api/events/evt-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("evt-1"));
    }

    @Test
    @DisplayName("DELETE /api/events/{id} returns 204 NO CONTENT")
    void deleteEvent_Returns204() throws Exception {
        mockMvc.perform(delete("/api/events/evt-1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/events/{id} returns 404 NOT FOUND when missing")
    void deleteEvent_Returns404() throws Exception {
        doThrow(new EventNotFoundException("missing")).when(eventService).deleteEvent("missing");

        mockMvc.perform(delete("/api/events/missing"))
                .andExpect(status().isNotFound());
    }
}
