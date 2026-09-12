package com.vbs.event_recorder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuickStatsDto {

    private long totalEvents;
    private long thisMonth;
    private long upcoming;
    private long completed;
}
