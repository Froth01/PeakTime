package com.dinnertime.peaktime.domain.group.service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GroupCreateRequestDto {

    @NotBlank
    @Length(max = 32, message = "프리셋 타이틀이 6자를 초과하거나 2자 미만일 수 없습니다.")
    private String title;

    @NotNull
    private Long presetId;
}
