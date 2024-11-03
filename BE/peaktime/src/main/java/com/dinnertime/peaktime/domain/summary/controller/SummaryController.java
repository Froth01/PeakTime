package com.dinnertime.peaktime.domain.summary.controller;

import com.dinnertime.peaktime.domain.memo.service.MemoService;
import com.dinnertime.peaktime.domain.summary.service.SummaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/summaries")
@RequiredArgsConstructor
public class SummaryController {

    private final SummaryService summaryService;

    // 요약 저장

    // 요약 삭제


}
