package com.dinnertime.peaktime.domain.timer.service.strategy;

import com.dinnertime.peaktime.domain.group.service.dto.response.GroupDetailResponseDto;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import org.springframework.stereotype.Service;

@Service
public class SingleTimerStrategy implements TimerStrategy{
    @Override
    public GroupDetailResponseDto createTimer(TimerCreateRequestDto requestDto) {
        return null;
    }

    @Override
    public GroupDetailResponseDto deleteTimer(Long timerId) {
        return null;
    }
}
