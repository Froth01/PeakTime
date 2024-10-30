package com.dinnertime.peaktime.domain.timer.service.dto.response;

import com.dinnertime.peaktime.domain.timer.entity.Timer;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TimerItemResponseDto {

    private Long timerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean isRepeat;
    private int[] repeatDay;

    @Builder
    private TimerItemResponseDto(Long timerId, LocalDateTime startTime, LocalDateTime endTime, Boolean isRepeat, int[] repeatDay) {
        this.timerId = timerId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isRepeat = isRepeat;
        this.repeatDay = repeatDay;
    }

    public static TimerItemResponseDto createTimeItemResponseDto(Timer timer) {
        return TimerItemResponseDto.builder()
                .timerId(timer.getTimerId())
                .startTime(timer.getStartTime())
                .endTime(timer.getEndTime())
                .isRepeat(timer.getIsRepeat())
                .repeatDay(timer.getRepeatDay())
                .build();
    }
}
