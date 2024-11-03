package com.dinnertime.peaktime.domain.memo.service.dto.response;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class MemoWrapperResponseDto {
    private List<MemoResponseDto> memoList;

    @Builder
    private MemoWrapperResponseDto(List<MemoResponseDto> memoList) {
        this.memoList = memoList;
    }

    public static MemoWrapperResponseDto createMemoWrapperResponseDto(List<Memo> memos) {
        List<MemoResponseDto> responseDto = memos.stream()
                .map(MemoResponseDto::createMemoResponseDto)
                .toList();

        return MemoWrapperResponseDto.builder()
                .memoList(responseDto)
                .build();
    }

}
