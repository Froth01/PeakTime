package com.dinnertime.peaktime.domain.timer.service.strategy;

import com.dinnertime.peaktime.domain.group.service.dto.response.GroupDetailResponseDto;
import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import com.dinnertime.peaktime.domain.schedule.service.ScheduleService;
import com.dinnertime.peaktime.domain.timer.service.TimerService;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.global.util.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepeatTimerStrategy implements TimerStrategy{
    private final TimerService timerService;
    private final RedisService redisService;
    private final ScheduleService scheduleService;

    @Override
    public GroupDetailResponseDto createTimer(TimerCreateRequestDto requestDto) {
        Long groupId = requestDto.getGroupId();
        LocalDateTime startTime = requestDto.getStartTime();
        int attentionTime = requestDto.getAttentionTime();
        int repeatDay = requestDto.getRepeatDay();
        int plusMinute = (startTime.getHour() * 60) + startTime.getMinute();

        // 중복 체크 및 Redis에 타이머 추가
        redisService.checkForDuplicateTimer(groupId, repeatDay, plusMinute, attentionTime);
        redisService.addTimerList(groupId, repeatDay, plusMinute, attentionTime);

        // 타이머와 스케줄 저장
        timerService.postTimer(requestDto);
        List<Schedule> scheduleList = scheduleService.createSchedule(requestDto);
        //오늘날짜가 있으면 저장
        scheduleService.saveTodayScheduleToRedis(scheduleList, repeatDay, startTime);

        return timerService.getTimerByGroupId(groupId);
    }

    @Override
    public GroupDetailResponseDto deleteTimer(Long timerId) {
        return null;
    }
}
