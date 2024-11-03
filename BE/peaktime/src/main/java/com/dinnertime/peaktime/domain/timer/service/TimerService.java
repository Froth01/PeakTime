package com.dinnertime.peaktime.domain.timer.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.timer.entity.Timer;
import com.dinnertime.peaktime.domain.timer.repository.TimerRepository;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TimerService {

    private final TimerRepository timerRepository;
    private final GroupRepository groupRepository;

    @Transactional
    public void postTimer(TimerCreateRequestDto requestDto) {
        Long groupId = requestDto.getGroupId();
        LocalDateTime startTime = requestDto.getStartTime();
        int attentionTime = requestDto.getAttentionTime();
        int[] repeatDay = requestDto.getRepeatDay();

        // 중복되는 타이머가 있는지 확인
        if (timerRepository.existsOverlappingTimers(groupId, startTime, attentionTime, repeatDay)) {
            throw new CustomException(ErrorCode.TIME_SLOT_OVERLAP);
        }

        // 그룹 정보 확인
        Group group = groupRepository.findByGroupIdAndIsDelete(requestDto.getGroupId(), false)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        // 타이머 생성 및 저장
        Timer timer = Timer.createTimer(
                group,
                startTime,
                attentionTime,
                requestDto.getIsRepeat(),
                repeatDay
        );
        timerRepository.save(timer);
    }

    @Transactional
    public void putTimer(Long timerId) {
        // is_repeat = false이고 repeat_day가 존재하는 경우 실행
        // 타이머가 실행될 때마다 repeat_day를 하나씩 지워서 update

        timerRepository.updateRepeatDayByTimerId(timerId);
    }

    @Transactional
    public void deleteTimer(Long timerId) {
        // is_repeat = false이고 repeat_day가 존재하지 않는 경우
        // 타이머 실행 완료 후 실행

        Timer timerSelected = timerRepository.findByTimerId(timerId)
                .orElseThrow(() -> new CustomException(ErrorCode.TIMER_NOT_FOUND));

        timerRepository.delete(timerSelected);
    }
}
