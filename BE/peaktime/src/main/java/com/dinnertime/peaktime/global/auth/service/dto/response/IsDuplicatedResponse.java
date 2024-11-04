package com.dinnertime.peaktime.global.auth.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class IsDuplicatedResponse {

    private boolean isDuplicated;

    @Builder
    private IsDuplicatedResponse(boolean isDuplicated) {
        this.isDuplicated = isDuplicated;
    }

    public static IsDuplicatedResponse createIsDuplicatedResponse(boolean isDuplicated) {
        return IsDuplicatedResponse.builder()
                .isDuplicated(isDuplicated)
                .build();
    }

}
