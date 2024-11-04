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
    private int attentionTime;
    private Boolean isRepeat;
    private int repeatDay;

    @Builder
<<<<<<< HEAD
    private TimerItemResponseDto(Long timerId, LocalDateTime startTime, LocalDateTime endTime, Boolean isRepeat, int repeatDay) {
=======
    private TimerItemResponseDto(Long timerId, LocalDateTime startTime, int attentionTime, Boolean isRepeat, int repeatDay) {
>>>>>>> 5a806db8f55419a2b19c2ff1d254ca35973cd5f0
        this.timerId = timerId;
        this.startTime = startTime;
        this.attentionTime = attentionTime;
        this.isRepeat = isRepeat;
        this.repeatDay = repeatDay;
    }

    public static TimerItemResponseDto createTimeItemResponseDto(Timer timer) {
        return TimerItemResponseDto.builder()
                .timerId(timer.getTimerId())
                .startTime(timer.getStartTime())
                .attentionTime(timer.getAttentionTime())
                .isRepeat(timer.getIsRepeat())
                .repeatDay(timer.getRepeatDay())
                .build();
    }
}
