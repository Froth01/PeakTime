package com.dinnertime.peaktime.domain.summary.service;

import com.dinnertime.peaktime.domain.summary.service.dto.request.SaveSummaryRequestDto;
import com.dinnertime.peaktime.global.util.chatgpt.ChatGPTService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class SummaryFacade {

    private final SummaryService summaryService;
    private final ChatGPTService chatGPTService;

    public void createOrUpdateSummary(SaveSummaryRequestDto requestDto, Long userId){

        String GPTContent = chatGPTService.getGPTResult(requestDto, userId);
        summaryService.createOrUpdateSummary(requestDto, GPTContent);
    }

    public void deleteSummary(Long summaryId){
        summaryService.deleteSummary(summaryId);
    }
}
