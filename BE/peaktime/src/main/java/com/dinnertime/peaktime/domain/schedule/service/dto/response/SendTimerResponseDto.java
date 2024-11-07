package com.dinnertime.peaktime.domain.schedule.service.dto.response;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SendTimerResponseDto {

    private Integer attentionTime;

    private Long presetId;

    private List<String> blockWebsiteList;

    private List<String> blockProgramList;


    @Builder
    private SendTimerResponseDto(Integer attentionTime, Long presetId, List<String> blockWebsiteList, List<String> blockProgramList) {
        this.attentionTime = attentionTime;
        this.presetId = presetId;
        this.blockWebsiteList = blockWebsiteList;
        this.blockProgramList = blockProgramList;
    }

    public static SendTimerResponseDto createSendTimerResponseDto(Integer attentionTime, Preset preset) {
        return SendTimerResponseDto.builder()
                .attentionTime(attentionTime)
                .presetId(preset.getPresetId())
                .blockWebsiteList(preset.getBlockWebsiteArray())
                .blockProgramList(preset.getBlockProgramArray())
                .build();
    }
}
