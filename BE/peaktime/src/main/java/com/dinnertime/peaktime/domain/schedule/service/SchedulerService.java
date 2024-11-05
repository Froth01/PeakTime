package com.dinnertime.peaktime.domain.schedule.service;

import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import com.dinnertime.peaktime.global.util.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchedulerService {

    private final ScheduleService scheduleService;
    private final RedisService redisService;

    //매일 0시에 실행
    @Scheduled(cron = "0 0 0 * * *")
    public void addScheduling() {
        //오늘 날짜 기준으로 가져오기
        List<Schedule> scheduleList = scheduleService.getSchedule();

        //저장
        redisService.addFirstSchedule(scheduleList);
    }
}