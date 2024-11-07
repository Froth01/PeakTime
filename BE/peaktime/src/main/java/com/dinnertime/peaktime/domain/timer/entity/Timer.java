package com.dinnertime.peaktime.domain.timer.entity;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "timers")
public class Timer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timer_id")
    private Long timerId;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "attention_time", nullable = false)
    @Min(30)
    @Max(240)
    private int attentionTime;

    @Column(name = "is_repeat", nullable = false)
    private Boolean isRepeat;

    @Column(name = "repeat_day", nullable = false)
    @Min(0)
    @Max(127)
    private int repeatDay;

    @Builder
    private Timer(Group group, LocalDateTime startTime, int attentionTime, Boolean isRepeat, int repeatDay) {
        this.group = group;
        this.startTime = startTime;
        this.attentionTime = attentionTime;
        this.isRepeat = isRepeat;
        this.repeatDay = repeatDay;
    }

    public static Timer createTimer(Group group, TimerCreateRequestDto requestDto) {
        return Timer.builder()
                .group(group)
                .startTime(requestDto.getStartTime())
                .attentionTime(requestDto.getAttentionTime())
                .isRepeat(requestDto.getIsRepeat())
                .repeatDay(requestDto.getRepeatDay())
                .build();
    }

    public static Timer copyTimer(Timer timer) {
        return Timer.builder()
                .group(timer.getGroup())
                .startTime(timer.getStartTime())
                .attentionTime(timer.getAttentionTime())
                .isRepeat(timer.getIsRepeat())
                .repeatDay(timer.getRepeatDay())
                .build();
    }
}
