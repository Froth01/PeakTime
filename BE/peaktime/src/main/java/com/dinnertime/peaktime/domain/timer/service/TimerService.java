package com.dinnertime.peaktime.domain.timer.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupDetailResponseDto;
import com.dinnertime.peaktime.domain.timer.entity.Timer;
import com.dinnertime.peaktime.domain.timer.repository.TimerRepository;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.domain.timer.service.dto.response.TimerItemResponseDto;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimerService {

    private final TimerRepository timerRepository;
    private final GroupRepository groupRepository;

    @Transactional
    public GroupDetailResponseDto postTimer(TimerCreateRequestDto requestDto) {
        Long groupId = requestDto.getGroupId();
        LocalDateTime startTime = requestDto.getStartTime();
        int attentionTime = requestDto.getAttentionTime();
        int repeatDay = requestDto.getRepeatDay();

        // 그룹 정보 확인
        Group group = groupRepository.findByGroupIdAndIsDeleteFalse(requestDto.getGroupId())
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        // 중복되는 타이머가 있는지 확인
        if (timerRepository.existsOverlappingTimers(groupId, startTime, attentionTime, repeatDay)) {
            throw new CustomException(ErrorCode.TIME_SLOT_OVERLAP);
        }

        // 타이머 생성 및 저장
        Timer timer = Timer.createTimer(group, requestDto);
        timerRepository.save(timer);

        // 타이머 리스트 조회
        List<TimerItemResponseDto> timerList = timerRepository.findByGroup_GroupId(groupId)
                .stream()
                .map(TimerItemResponseDto::createTimeItemResponseDto)
                .collect(Collectors.toList());

        return GroupDetailResponseDto.createGroupDetailResponseDto(group, timerList);
    }

    @Transactional
    public GroupDetailResponseDto deleteTimer(Long timerId) {
        Timer timerSelected = timerRepository.findByTimerId(timerId)
                .orElseThrow(() -> new CustomException(ErrorCode.TIMER_NOT_FOUND));

        Group group = timerSelected.getGroup();

        timerRepository.delete(timerSelected);

        // 타이머 리스트 조회
        List<TimerItemResponseDto> timerList = timerRepository.findByGroup_GroupId(group.getGroupId())
                .stream()
                .map(TimerItemResponseDto::createTimeItemResponseDto)
                .collect(Collectors.toList());

        return GroupDetailResponseDto.createGroupDetailResponseDto(group, timerList);

    }
}
