package com.vbs.event_recorder.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EventCategory {
    CLASS("Class"),
    CELEBRATION("Celebration"),
    CAMP("Camp"),
    COMPETITION("Competition"),
    SPECIAL_EVENT("Special Event");

    private final String displayName;

    EventCategory(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static EventCategory fromString(String text) {
        if (text == null || text.isBlank()) {
            return null;
        }
        for (EventCategory category : EventCategory.values()) {
            if (category.name().equalsIgnoreCase(text) || category.displayName.equalsIgnoreCase(text)) {
                return category;
            }
        }
        // Fallback or normalize common variations e.g. "SPECIAL_EVENT"
        String normalized = text.trim().replace(" ", "_").toUpperCase();
        for (EventCategory category : EventCategory.values()) {
            if (category.name().equalsIgnoreCase(normalized)) {
                return category;
            }
        }
        throw new IllegalArgumentException("Invalid EventCategory: " + text + ". Expected one of: Class, Celebration, Camp, Competition, Special Event");
    }
}
