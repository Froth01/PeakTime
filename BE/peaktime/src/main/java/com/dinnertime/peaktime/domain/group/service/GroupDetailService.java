package com.dinnertime.peaktime.domain.group.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupDetailRepository;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupDetailResponseDto;
import com.dinnertime.peaktime.domain.timer.repository.TimerRepository;
import com.dinnertime.peaktime.domain.timer.service.dto.response.TimerItemResponseDto;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupDetailService {

    private final GroupDetailRepository groupDetailRepository;
    private final TimerRepository timerRepository;

    @Transactional
    public GroupDetailResponseDto getGroupDetail(Long groupId) {
        // 그룹 조회
        Group group = groupDetailRepository.findByGroupIdAndIsDelete(groupId, false)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        // 타이머 리스트 조회
        List<TimerItemResponseDto> timerList = timerRepository.findByGroup_GroupId(groupId)
                .stream()
                .map(timer -> TimerItemResponseDto.createTimeItemResponseDto(
                        timer.getTimerId(),
                        timer.getStartTime(),
                        timer.getEndTime(),
                        timer.getIsRepeat(),
                        timer.getRepeatDay()
                ))
                .collect(Collectors.toList());

        return GroupDetailResponseDto.createGroupDetailResponseDto(
                group.getTitle(),
                group.getPreset().getPresetId(),
                group.getPreset().getTitle(),
                timerList
        );
    }
}
