package com.dinnertime.peaktime.domain.summary.service;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import com.dinnertime.peaktime.domain.memo.repository.MemoRepository;
import com.dinnertime.peaktime.domain.summary.entity.Summary;
import com.dinnertime.peaktime.domain.summary.repository.SummaryRepository;
import com.dinnertime.peaktime.domain.summary.service.dto.request.SaveSummaryRequestDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.chatgpt.ChatGPTService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.file.attribute.UserPrincipal; // 추후 수정

@Slf4j
@RequiredArgsConstructor
@Service
public class SummaryService {

    // 요약 저장, 삭제 구현
    private final SummaryRepository summaryRepository;
    private final UserRepository userRepository;
    private final MemoRepository memoRepository;

    // 요약 정보 저장 및 업데이트
    @Transactional
    public void createOrUpdateSummary(UserPrincipal userPrincipal, SaveSummaryRequestDto requestDto, String GPTContent) {

        User user = userRepository.findByUserIdAndIsDeleteFalse(1).
                orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Memo memo = memoRepository.findByMemoId(requestDto.getMemoId())
                .orElseThrow(() -> new CustomException(ErrorCode.MEMO_NOT_FOUND));

        log.info("getContent: {}", requestDto.getContent());

//        String GPTContent = chatGPTService.getGPTResult(requestDto);
//        log.info("gptContent: {}", GPTContent);
        // insert, update를 별개로 처리해야 하므로 분기 처리 진행
        // memo가 null인 경우엔 insert, 이미 존재하는 경우는 update로 진행하도록 설정


        Summary summary = summaryRepository.findByMemo(memo);
        log.info("summary :" + summary);

        // summary의 gpt 요약 내용 컨텐츠 업데이트 후 저장 필요

        if(summary == null) {
            // insert
            Summary createdSummary = Summary.createSummary(GPTContent, memo);
            summaryRepository.save(createdSummary);
        } else{
            // update
            summary.updateSummary(GPTContent, memo);
            summaryRepository.save(summary);
        }

    }


    @Transactional
    public void deleteSummary(UserPrincipal userPrincipal, Long summaryId) {

        User user = userRepository.findByUserIdAndIsDeleteFalse(1).
                orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Summary summary = summaryRepository.findBySummaryId(summaryId)
                .orElseThrow(() -> new CustomException(ErrorCode.SUMMARY_NOT_FOUND));

        summaryRepository.delete(summary);
    }

}
