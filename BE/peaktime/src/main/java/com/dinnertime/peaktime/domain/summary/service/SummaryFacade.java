package com.dinnertime.peaktime.domain.summary.service;

import com.dinnertime.peaktime.domain.summary.service.dto.request.SaveSummaryRequestDto;
import com.dinnertime.peaktime.global.util.chatgpt.ChatGPTService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.file.attribute.UserPrincipal;

@Service
@Slf4j
@RequiredArgsConstructor
public class SummaryFacade {

    private final SummaryService summaryService;
    private final ChatGPTService chatGPTService;

    public void createOrUpdateSummary(UserPrincipal userPrincipal, SaveSummaryRequestDto requestDto){

        String GPTContent = chatGPTService.getGPTResult(requestDto);
        summaryService.createOrUpdateSummary(userPrincipal, requestDto, GPTContent);
    }

    public void deleteSummary(UserPrincipal userPrincipal, Long summaryId){
        summaryService.deleteSummary(userPrincipal, summaryId);
    }
}
