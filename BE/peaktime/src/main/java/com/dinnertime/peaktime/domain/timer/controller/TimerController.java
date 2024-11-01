package com.dinnertime.peaktime.domain.timer.controller;

import com.dinnertime.peaktime.domain.timer.service.TimerService;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.global.util.ResultDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/timers")
@RequiredArgsConstructor
public class TimerController {

    private final TimerService timerService;

    @PostMapping("")
    public ResponseEntity<?> postTimer(@RequestBody TimerCreateRequestDto requestDto) {
        timerService.postTimer(requestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(ResultDto.res(HttpStatus.CREATED.value(), "타이머 생성을 성공했습니다."));
    }

    @DeleteMapping("/{timerId}")
    public ResponseEntity<?> deleteTimer(@PathVariable Long timerId) {
        timerService.deleteTimer(timerId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ResultDto.res(HttpStatus.NO_CONTENT.value(), "타이머 삭제를 성공했습니다."));
    }

}
