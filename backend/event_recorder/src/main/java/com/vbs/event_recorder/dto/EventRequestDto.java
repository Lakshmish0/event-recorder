package com.vbs.event_recorder.dto;

import com.vbs.event_recorder.model.EventCategory;
import com.vbs.event_recorder.model.EventStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Category is required")
    private EventCategory category;

    private Instant startDateTime;

    private Instant endDateTime;

    // Convenience fields matching frontend form
    private String startDate; // YYYY-MM-DD
    private String endDate;   // YYYY-MM-DD
    private String startTime; // e.g. "09:00 AM" or "09:00"
    private String endTime;   // e.g. "05:00 PM" or "17:00"

    private String location;

    private String description;

    private String notes; // Alias for description in frontend

    private String imageUrl;

    private EventStatus status;

    /**
     * Resolve final startDateTime from either Instant or startDate + startTime fields
     */
    public Instant resolveStartDateTime() {
        if (startDateTime != null) {
            return startDateTime;
        }
        if (startDate != null && !startDate.isBlank()) {
            return parseDateTimeToInstant(startDate, startTime, true);
        }
        return Instant.now();
    }

    /**
     * Resolve final endDateTime from either Instant or endDate + endTime fields
     */
    public Instant resolveEndDateTime() {
        if (endDateTime != null) {
            return endDateTime;
        }
        if (endDate != null && !endDate.isBlank()) {
            return parseDateTimeToInstant(endDate, endTime, false);
        }
        Instant start = resolveStartDateTime();
        return start.plusSeconds(3600); // Default to 1 hour after start if unspecified
    }

    /**
     * Resolve description / notes string
     */
    public String resolveDescription() {
        if (description != null && !description.isBlank()) {
            return description;
        }
        return notes != null ? notes : "";
    }

    private Instant parseDateTimeToInstant(String dateStr, String timeStr, boolean isStart) {
        try {
            LocalDate date = LocalDate.parse(dateStr.trim());
            LocalTime time;
            if (timeStr == null || timeStr.isBlank()) {
                time = isStart ? LocalTime.of(9, 0) : LocalTime.of(17, 0);
            } else {
                time = parseTime(timeStr.trim());
            }
            LocalDateTime ldt = LocalDateTime.of(date, time);
            return ldt.atZone(ZoneId.of("UTC")).toInstant();
        } catch (Exception e) {
            return Instant.now();
        }
    }

    private LocalTime parseTime(String timeStr) {
        String cleaned = timeStr.trim().toUpperCase(Locale.ROOT);
        String[] patterns = {"hh:mm a", "h:mm a", "HH:mm", "H:mm"};
        for (String pattern : patterns) {
            try {
                return LocalTime.parse(cleaned, DateTimeFormatter.ofPattern(pattern, Locale.ENGLISH));
            } catch (DateTimeParseException ignored) {
            }
        }
        return LocalTime.of(9, 0);
    }
}
