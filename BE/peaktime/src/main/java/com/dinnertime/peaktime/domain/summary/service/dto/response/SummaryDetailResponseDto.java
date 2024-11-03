package com.dinnertime.peaktime.domain.summary.service.dto.response;

import com.dinnertime.peaktime.domain.summary.entity.Summary;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SummaryDetailResponseDto {

    private Long summaryId;
    private String summaryContent;
    private LocalDateTime summaryUpdateAt;

    // 요약 정보가 담긴 responseDto 작성
    @Builder
    private SummaryDetailResponseDto(Long summaryId, String summaryContent, LocalDateTime summaryUpdateAt) {
        this.summaryId = summaryId;
        this.summaryContent = summaryContent;
        this.summaryUpdateAt = summaryUpdateAt;
    }

    public static SummaryDetailResponseDto createSummaryDetailResponse(Summary summary) {
        if (summary == null) { return null; } // summary가 존재하지 않는 경우는 null 반환

        return SummaryDetailResponseDto.builder()
                .summaryId(summary.getSummaryId())
                .summaryContent(summary.getContent())
                .summaryUpdateAt(summary.getUpdateAt())
                .build();
    }

}
