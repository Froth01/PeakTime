package com.dinnertime.peaktime.domain.hiking.service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ContentListRequestDto {

    @NotNull
    private String contentName;

    @NotNull
    private String contentType;

    @NotNull
    private Integer usingTime;

    @NotNull
    private Boolean isBlockContent;
}
