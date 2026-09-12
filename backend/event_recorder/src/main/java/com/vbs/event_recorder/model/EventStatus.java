package com.vbs.event_recorder.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EventStatus {
    UPCOMING("Upcoming"),
    LATER("Later"),
    COMPLETED("Completed"),
    ONGOING("Ongoing");

    private final String displayName;

    EventStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static EventStatus fromString(String text) {
        if (text == null || text.isBlank()) {
            return null;
        }
        for (EventStatus status : EventStatus.values()) {
            if (status.name().equalsIgnoreCase(text) || status.displayName.equalsIgnoreCase(text)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid EventStatus: " + text + ". Expected one of: Upcoming, Later, Completed, Ongoing");
    }
}
