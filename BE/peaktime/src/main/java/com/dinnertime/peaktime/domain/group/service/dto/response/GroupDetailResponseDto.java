package com.dinnertime.peaktime.domain.group.service.dto.response;

import com.dinnertime.peaktime.domain.timer.service.dto.response.TimerItemResponseDto;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GroupDetailResponseDto {

    private String title;
    private Long presetId;
    private String presetTitle;
    private List<TimerItemResponseDto> timerList;

    @Builder
    private GroupDetailResponseDto(String title, Long presetId, String presetTitle, List<TimerItemResponseDto> timerList) {
        this.title = title;
        this.presetId = presetId;
        this.presetTitle = presetTitle;
        this.timerList = timerList;
    }

    public static GroupDetailResponseDto createGroupDetailResponseDto(String title, Long presetId, String presetTitle, List<TimerItemResponseDto> timerList) {
        return GroupDetailResponseDto.builder()
                .title(title)
                .presetId(presetId)
                .presetTitle(presetTitle)
                .timerList(timerList)
                .build();
    }
}
