package com.dinnertime.peaktime.domain.memo.service.dto.response;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import com.dinnertime.peaktime.domain.summary.entity.Summary;
import com.dinnertime.peaktime.domain.summary.service.dto.response.SummaryDetailResponseDto;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemoSummaryResponseDto {

    private MemoDetailResponseDto memoDetail;
    private SummaryDetailResponseDto summaryDetail;

    @Builder
    private MemoSummaryResponseDto (MemoDetailResponseDto memoDetail, SummaryDetailResponseDto summaryDetail) {
        this.memoDetail = memoDetail;
        this.summaryDetail = summaryDetail;
    }

    public static MemoSummaryResponseDto createMemoSummaryResponse(Memo memo, Summary summary) {
        MemoDetailResponseDto memoDetail = MemoDetailResponseDto.createMemoDetailResponse(memo);

        // summary null이면 SummaryDetailResponseDto도 null로 반환되게 설계
        SummaryDetailResponseDto summaryDetail = SummaryDetailResponseDto.createSummaryDetailResponse(summary);

        return MemoSummaryResponseDto.builder()
                .memoDetail(memoDetail)
                .summaryDetail(summaryDetail)
                .build();
    }



}
