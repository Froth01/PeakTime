package com.dinnertime.peaktime.domain.schedule.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SendTimerResponseDto {
    private Integer attentionTime;

    @Builder
    private SendTimerResponseDto(Integer attentionTime) {
        this.attentionTime = attentionTime;
    }

    public static SendTimerResponseDto createSendTimerResponseDto(Integer attentionTime) {
        return SendTimerResponseDto.builder()
                .attentionTime(attentionTime)
                .build();
    }
}
