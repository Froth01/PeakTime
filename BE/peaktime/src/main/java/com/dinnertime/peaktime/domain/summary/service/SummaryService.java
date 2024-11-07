package com.dinnertime.peaktime.domain.summary.service;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import com.dinnertime.peaktime.domain.memo.repository.MemoRepository;
import com.dinnertime.peaktime.domain.summary.entity.Summary;
import com.dinnertime.peaktime.domain.summary.repository.SummaryRepository;
import com.dinnertime.peaktime.domain.summary.service.dto.request.SaveSummaryRequestDto;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Slf4j
@RequiredArgsConstructor
@Service
public class SummaryService {

    // 요약 저장, 삭제 구현
    private final SummaryRepository summaryRepository;
    private final MemoRepository memoRepository;

    // 요약 정보 저장 및 업데이트
    @Transactional
    public void createOrUpdateSummary(SaveSummaryRequestDto requestDto, String GPTContent) {

        Memo memo = memoRepository.findByMemoId(requestDto.getMemoId())
                .orElseThrow(() -> new CustomException(ErrorCode.MEMO_NOT_FOUND));

        // insert, update를 별개로 처리해야 하므로 분기 처리 진행
        // memo가 null인 경우엔 insert, 이미 존재하는 경우는 update로 진행하도록 설정

        Summary summary = summaryRepository.findByMemo_MemoId(memo.getMemoId());

        if(summary == null) {
            // insert
            Summary createdSummary = Summary.createSummary(GPTContent, memo);
            summaryRepository.save(createdSummary);
            return;
        }
        // update
        summary.updateSummary(GPTContent);
        summaryRepository.save(summary);
    }


    @Transactional
    public void deleteSummary(Long summaryId) {

        Summary summary = summaryRepository.findBySummaryId(summaryId)
                .orElseThrow(() -> new CustomException(ErrorCode.SUMMARY_NOT_FOUND));

        summaryRepository.delete(summary);
    }

}
