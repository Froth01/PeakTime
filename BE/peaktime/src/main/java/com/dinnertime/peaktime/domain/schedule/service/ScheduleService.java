package com.dinnertime.peaktime.domain.schedule.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import com.dinnertime.peaktime.domain.schedule.repository.ScheduleRepository;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final GroupRepository groupRepository;

    @Transactional
    public List<Schedule> createSchedule(TimerCreateRequestDto requestDto) {
        int repeatDay = requestDto.getRepeatDay();
        int attentionTime = requestDto.getAttentionTime();
        LocalTime startTime = requestDto.getStartTime().toLocalTime();

        Group group = groupRepository.findByGroupIdAndIsDeleteFalse(requestDto.getGroupId()).orElseThrow(
                () -> new CustomException(ErrorCode.GROUP_NOT_FOUND)
        );

        List<Schedule> scheduleList = new ArrayList<>();

        //6이 월요일 0이 일요일
        for(int i=0; i<6;i++) {
            if((repeatDay & (1 << i)) != 0) {
                Schedule schedule = Schedule.createSchedule(i, startTime, attentionTime, group);
                scheduleList.add(schedule);
            }
        }
        //스케쥴링 모두 저장
        scheduleRepository.saveAll(scheduleList);

        return scheduleList;
    }

    @Transactional(readOnly = true)
    public List<Schedule> getSchedule() {
        int dayOfWeek = 7 - LocalDate.now().getDayOfWeek().getValue();
        return scheduleRepository.findAllByDayOfWeek(dayOfWeek);
    }

}
