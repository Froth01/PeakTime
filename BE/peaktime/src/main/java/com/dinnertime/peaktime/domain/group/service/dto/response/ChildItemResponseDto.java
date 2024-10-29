package com.dinnertime.peaktime.domain.group.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChildItemResponseDto {
    private Long userId;
    private String userLoginId;
    private String nickname;

    @Builder
    public ChildItemResponseDto(Long userId, String userLoginId, String nickname) {
        this.userId = userId;
        this.userLoginId = userLoginId;
        this.nickname = nickname;
    }
}
