package com.dinnertime.peaktime.domain.timer.service.facade;

import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import com.dinnertime.peaktime.domain.schedule.service.ScheduleService;
import com.dinnertime.peaktime.domain.timer.service.TimerService;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.chrono.ChronoLocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TimerFacade {
    private final TimerService timerService;
    private final ScheduleService scheduleService;
    private final RedisService redisService;

    public void createTimer(TimerCreateRequestDto requestDto) {

        //레디스 체크
        Long groupId = requestDto.getGroupId();
        LocalDateTime startTime = requestDto.getStartTime();
        int attentionTime = requestDto.getAttentionTime();
        int repeatDay = requestDto.getRepeatDay();

        int plusMinute = (startTime.getHour()*60) + startTime.getMinute();

        for(int i=0; i<6;i++) {
            if((repeatDay & (1 << i)) != 0) {
                //날짜를 일차원 배열로 만들기 위함
                int start = 14400 * i + plusMinute;
                int end = start + attentionTime;
                boolean checkDuplicate = redisService.checkTimerByGroupId(groupId, start, end);
                if(checkDuplicate) {
                    throw new CustomException(ErrorCode.TIME_SLOT_OVERLAP);
                }
            }
        }

        log.info("중복 체크");

        for(int i=0; i<6;i++) {
            if((repeatDay & (1 << i)) != 0) {
                //날짜를 일차원 배열로 만들기 위함
                int start = 14400 * i + plusMinute;
                int end = start + attentionTime;
                redisService.addTimerByGroupId(groupId, start, end);
            }
        }

        log.info("저장");

        //타이머 서비스에서 postTimer 사용하여 저장
        timerService.postTimer(requestDto);

        //스케쥴링 저장
        List<Schedule> scheduleList = scheduleService.createSchedule(requestDto);

        //현재 시간 이후 내일 이전에 값이 존재하면 레디스에 저장
        int todayDayOfWeek = 7 - LocalDateTime.now().getDayOfWeek().getValue();

        if((repeatDay & (1<<todayDayOfWeek)) != 0 && startTime.isAfter(ChronoLocalDateTime.from(LocalTime.now()))) {
            Schedule schedule = null;
            for(Schedule s: scheduleList) {
                if(s.getDayOfWeek() == todayDayOfWeek) {
                    schedule = s;
                    break;
                }
            }
            redisService.addSchedule(schedule);
        }

    }

}
