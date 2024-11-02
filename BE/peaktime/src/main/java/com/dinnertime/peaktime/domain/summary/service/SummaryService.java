package com.dinnertime.peaktime.domain.summary.service;

import com.dinnertime.peaktime.domain.summary.entity.Summary;
import com.dinnertime.peaktime.domain.summary.repository.SummaryRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.file.attribute.UserPrincipal;

@Slf4j
@RequiredArgsConstructor
@Service
public class SummaryService {

    // 요약 저장, 삭제 구현
    private final SummaryRepository summaryRepository;
    private final UserRepository userRepository;

    @Transactional
    public void deleteSummary(UserPrincipal userPrincipal, Long summaryId) {

        User user = userRepository.findByUserId(1).
                orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Summary summary = summaryRepository.findBySummaryId(summaryId)
                .orElseThrow(() -> new CustomException(ErrorCode.SUMMARY_NOT_FOUND));

        summaryRepository.delete(summary);
    }

}
