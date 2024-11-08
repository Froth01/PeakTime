package com.dinnertime.peaktime.domain.timer.service.facade;

import com.dinnertime.peaktime.domain.group.service.dto.response.GroupDetailResponseDto;
import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import com.dinnertime.peaktime.domain.schedule.service.ScheduleService;
import com.dinnertime.peaktime.domain.timer.entity.Timer;
import com.dinnertime.peaktime.domain.timer.service.TimerService;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TimerFacade {
    private final TimerService timerService;
    private final ScheduleService scheduleService;
    private final RedisService redisService;

    private static final int DAY = 7;
    private static final int DAY_MINUTE = 1440;


    @Transactional
    public GroupDetailResponseDto createTimer(TimerCreateRequestDto requestDto) {

        //1번 타이머 반복 하지 않는 경우
        if(requestDto.getIsRepeat()) {

        }

        //2번 타이머 반복하는 경우

        //레디스 체크
        Long groupId = requestDto.getGroupId();
        LocalDateTime startTime = requestDto.getStartTime();
        int attentionTime = requestDto.getAttentionTime();
        int repeatDay = requestDto.getRepeatDay();

        int plusMinute = (startTime.getHour()*60) + startTime.getMinute();

        for(int i=0; i<DAY;i++) {
            if((repeatDay & (1 << i)) != 0) {
                //날짜를 일차원 배열로 만들기 위함
                int start = DAY_MINUTE * i + plusMinute;
                int end = start + attentionTime;
                boolean checkDuplicate = redisService.checkTimerByGroupId(groupId, start, end);
                if(checkDuplicate) {
                    throw new CustomException(ErrorCode.TIME_SLOT_OVERLAP);
                }
            }
        }

        log.info("중복 체크");

        for(int i=0; i<DAY;i++) {
            if((repeatDay & (1 << i)) != 0) {
                //날짜를 일차원 배열로 만들기 위함
                int start = DAY_MINUTE * i + plusMinute;
                int end = start + attentionTime;
//                redisService.addTimerByGroupId(groupId, start, end);
            }
        }

        log.info("저장");

        //타이머 서비스에서 postTimer 사용하여 저장
        Timer timer = timerService.postTimer(requestDto);

        //스케쥴링 저장
        List<Schedule> scheduleList = scheduleService.createSchedule(requestDto, timer);

        //현재 시간 이후 내일 이전에 값이 존재하면 레디스에 저장
        int todayDayOfWeek = DAY - LocalDateTime.now().getDayOfWeek().getValue();

        LocalTime startLocalTime = startTime.toLocalTime();

        if((repeatDay & (1<<todayDayOfWeek)) != 0 && startLocalTime.isAfter(LocalTime.now())) {
            log.info("오늘 것 저장");
            Schedule schedule = null;
            for(Schedule s: scheduleList) {
                if(s.getDayOfWeek() == todayDayOfWeek) {
                    schedule = s;
                    break;
                }
            }
            redisService.addSchedule(schedule);
        }

        return timerService.getTimerByGroupId(requestDto.getGroupId());

    }

    @Transactional
    public GroupDetailResponseDto deleteTimer(Long timerId) {
        //타이머 삭제
        Timer timer = timerService.deleteTimer(timerId);

        //레디스 삭제
        int repeatDay = timer.getRepeatDay();
        LocalDateTime startTime = timer.getStartTime();
        int attentionTime = timer.getAttentionTime();

        int plusMinute = (startTime.getHour()*60) + startTime.getMinute();

        for(int i=0; i<DAY;i++) {
            if((repeatDay & (1 << i)) != 0) {
                //날짜를 일차원 배열로 만들기 위함
                int start = DAY_MINUTE * i + plusMinute;
                int end = start + attentionTime;
                redisService.deleteTimerByTimer(timer.getGroup().getGroupId(), start, end);
            }
        }

        //스케쥴 삭제
        scheduleService.deleteSchedule(timer);

        //레디스 스케쥴러 삭제

        return timerService.getTimerByGroupId(timer.getGroup().getGroupId());
    }

}
