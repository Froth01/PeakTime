package com.dinnertime.peaktime.domain.timer.entity;

import com.dinnertime.peaktime.domain.group.entity.Group;
import io.hypersistence.utils.hibernate.type.array.IntArrayType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

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
    private int attentionTime;

    @Column(name = "is_repeat", nullable = false)
    private Boolean isRepeat;

    @Type(IntArrayType.class)
    @Column(name = "repeat_day", nullable = false, columnDefinition = "Integer[]")
    private int[] repeatDay;

    @Builder
    private Timer(Group group, LocalDateTime startTime, int attentionTime, Boolean isRepeat, int[] repeatDay) {
        this.group = group;
        this.startTime = startTime;
        this.attentionTime = attentionTime;
        this.isRepeat = isRepeat;
        this.repeatDay = repeatDay;
    }

    public static Timer createTimer(Group group, LocalDateTime startTime, int attentionTime, Boolean isRepeat, int[] repeatDay) {
        return Timer.builder()
                .group(group)
                .startTime(startTime)
                .attentionTime(attentionTime)
                .isRepeat(isRepeat)
                .repeatDay(repeatDay)
                .build();
    }
}
