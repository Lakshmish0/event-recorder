package com.vbs.event_recorder.dto;

import com.vbs.event_recorder.model.Event;
import com.vbs.event_recorder.model.EventCategory;
import com.vbs.event_recorder.model.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponseDto {

    private String id;

    private String title;

    private EventCategory category;

    private Instant startDateTime;

    private Instant endDateTime;

    private String startDate; // YYYY-MM-DD for frontend compatibility

    private String endDate;   // YYYY-MM-DD for frontend compatibility

    private String startTime; // e.g. "09:00 AM"

    private String endTime;   // e.g. "05:00 PM"

    private String location;

    private String description;

    private String notes;     // Alias for description in frontend

    private String imageUrl;

    private EventStatus status;

    private Instant createdAt;

    private Instant updatedAt;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd").withZone(ZoneId.of("UTC"));
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH).withZone(ZoneId.of("UTC"));

    public static EventResponseDto fromEntity(Event event) {
        if (event == null) return null;

        String startDateStr = event.getStartDateTime() != null ? DATE_FORMATTER.format(event.getStartDateTime()) : "";
        String endDateStr = event.getEndDateTime() != null ? DATE_FORMATTER.format(event.getEndDateTime()) : "";
        String startTimeStr = event.getStartDateTime() != null ? TIME_FORMATTER.format(event.getStartDateTime()) : "";
        String endTimeStr = event.getEndDateTime() != null ? TIME_FORMATTER.format(event.getEndDateTime()) : "";
        String desc = event.getDescription() != null ? event.getDescription() : "";

        return EventResponseDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .category(event.getCategory())
                .startDateTime(event.getStartDateTime())
                .endDateTime(event.getEndDateTime())
                .startDate(startDateStr)
                .endDate(endDateStr)
                .startTime(startTimeStr)
                .endTime(endTimeStr)
                .location(event.getLocation())
                .description(desc)
                .notes(desc)
                .imageUrl(event.getImageUrl())
                .status(event.getStatus())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
