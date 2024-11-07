package com.dinnertime.peaktime.domain.timer.service.facade;

import com.dinnertime.peaktime.domain.group.service.dto.response.GroupDetailResponseDto;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.domain.timer.service.strategy.RepeatTimerStrategy;
import com.dinnertime.peaktime.domain.timer.service.strategy.SingleTimerStrategy;
import com.dinnertime.peaktime.domain.timer.service.strategy.TimerStrategy;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TimerFacadeTmp {
    private final RepeatTimerStrategy repeatTimerStrategy;
    private final SingleTimerStrategy singleTimerStrategy;

    @Transactional
    public GroupDetailResponseDto createTimer(TimerCreateRequestDto requestDto) {
        //타이머가 반복인지 아닌지 확인 후 다른 형태의 서비스로 사용
        TimerStrategy strategy = requestDto.getIsRepeat() ? repeatTimerStrategy : singleTimerStrategy;
        return strategy.createTimer(requestDto);
    }
}
