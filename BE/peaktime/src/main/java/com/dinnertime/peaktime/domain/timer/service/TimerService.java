package com.dinnertime.peaktime.domain.timer.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.timer.entity.Timer;
import com.dinnertime.peaktime.domain.timer.repository.TimerRepository;
import com.dinnertime.peaktime.domain.timer.service.dto.TimerPair;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimerService {

    private final TimerRepository timerRepository;
    private final GroupRepository groupRepository;

    public Boolean isZerosArray(int[] repeatDay) {
        return Arrays.stream(repeatDay).allMatch(day -> day == 0);
    }

    public List<TimerPair> timerArray(LocalDateTime startTime, int attentionTime, int[] repeatDay) {
        List<TimerPair> timerArray = new ArrayList<>();

        LocalDateTime endTime = startTime.plusMinutes(attentionTime);

        if (isZerosArray(repeatDay)) {
            // ZerosArray인 경우, 지정된 [startTime, endTime] 하나만 입력
            TimerPair timerPair = new TimerPair(startTime, endTime);
            timerArray.add(timerPair);
        } else {
            // ZerosArray가 아닌 경우, 오늘 날짜에 맞춘 1주일간의 [startTime, endTime] 생성해 각각 입력

            // 시작, 끝 시각
            LocalTime startTimeOnly = startTime.toLocalTime();
            LocalTime endTimeOnly = endTime.toLocalTime();

            // 오늘 날짜, 오늘 요일 (0~6)
            LocalDate today = LocalDate.now();
            int dayOfTheWeekToday = today.getDayOfWeek().getValue() - 1;

            for (int idx = 0; idx < repeatDay.length; idx++) {
                if (repeatDay[idx] == 1) {
                    LocalDate day = today.plusDays(idx - dayOfTheWeekToday >= 0 ? idx - dayOfTheWeekToday : 7 + idx - dayOfTheWeekToday);
                    TimerPair timerPair = new TimerPair(LocalDateTime.of(day, startTimeOnly), LocalDateTime.of(day, endTimeOnly));
                    timerArray.add(timerPair);
                }
            }
        }

        return timerArray;
    }

    public Boolean isTimeOverlapping(TimerCreateRequestDto requestDto, List<Timer> timerList) {
        List<TimerPair> requestTimerList = timerArray(requestDto.getStartTime(), requestDto.getAttentionTime(), requestDto.getRepeatDay());

        for (Timer timer:timerList) {
            List<TimerPair> timerPairs = timerArray(timer.getStartTime(), timer.getAttentionTime(), timer.getRepeatDay());

            boolean isOverlap = requestTimerList.stream().anyMatch(requestTimer ->
                    timerPairs.stream().anyMatch(timerPair ->
                            !requestTimer.getStartTime().isAfter(timerPair.getEndTime()) &&
                            !timerPair.getStartTime().isAfter(requestTimer.getEndTime())
                    )
            );

            if (isOverlap) return true;
        }
        return false;
    }

    @Transactional
    public void postTimer(TimerCreateRequestDto requestDto) {

        Group group = groupRepository.findByGroupIdAndIsDelete(requestDto.getGroupId(), false)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        // 현재 그룹의 타이머 모두 조회
        List<Timer> timerList = timerRepository.findByGroup_GroupId(requestDto.getGroupId());

        // requestDto의 타이머와 시간 비교해 에러 처리
        if (isTimeOverlapping(requestDto, timerList)) {
            throw new CustomException(ErrorCode.TIME_SLOT_OVERLAP);
        }

        Timer timer = Timer.createTimer(
                group,
                requestDto.getStartTime(),
                requestDto.getAttentionTime(),
                requestDto.getIsRepeat(),
                requestDto.getRepeatDay()
        );
        timerRepository.save(timer);
    }

    @Transactional
    public void deleteTimer(Long timerId) {
        Timer timerSelected = timerRepository.findByTimer_TimerId(timerId)
                .orElseThrow(() -> new CustomException(ErrorCode.TIMER_NOT_FOUND));


    }

}
