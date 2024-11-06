package com.dinnertime.peaktime.domain.schedule.controller;

import com.dinnertime.peaktime.domain.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
@RequestMapping("/schedule")
public class ScheduleController {
    private final ScheduleService scheduleService;

    //타입을 TEXT_EVENT_STREAM_VALUE 명시해야 서버가 클라어언트에 메시지 스트림을 전송한다는 것을 명시하여 연결 유지 가능
    //lastEventId sse 연결이 끊어졌을 경우 마지막 이벤트 아이디
    @GetMapping(value = "", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(
//            @AuthenticationPrincipal final Principal principal,
            @RequestHeader(value = "LAST-EVENT-ID", required = false, defaultValue = "") String lastEventId
    ) {
        //구독 하기
        return scheduleService.subScribe(2L, lastEventId);
    }
}
