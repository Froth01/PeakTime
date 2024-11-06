package com.dinnertime.peaktime.domain.timer.service.dto.response;

import com.dinnertime.peaktime.domain.timer.entity.Timer;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TimerCreateResponseDto {

    private Long timerId;
    private LocalDateTime startTime;
    private int attentionTime;
    private Boolean isRepeat;
    private int repeatDay;

    @Builder
    private TimerCreateResponseDto(Long timerId, LocalDateTime startTime, int attentionTime, Boolean isRepeat, int repeatDay) {
        this.timerId = timerId;
        this.startTime = startTime;
        this.attentionTime = attentionTime;
        this.isRepeat = isRepeat;
        this.repeatDay = repeatDay;
    }

    public static TimerCreateResponseDto createTimerCreateResponseDto(Timer timer) {
        return TimerCreateResponseDto.builder()
                .timerId(timer.getTimerId())
                .startTime(timer.getStartTime())
                .attentionTime(timer.getAttentionTime())
                .isRepeat(timer.getIsRepeat())
                .repeatDay(timer.getRepeatDay())
                .build();
    }
}
