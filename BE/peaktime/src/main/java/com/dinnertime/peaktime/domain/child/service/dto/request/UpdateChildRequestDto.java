package com.dinnertime.peaktime.domain.child.service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class UpdateChildRequestDto {

    @NotNull
    Long groupId;
    @NotBlank
    @Length(min = 2, max = 8, message = "2자 이상 8자 이하의 닉네임을 입력주세요.")
    String childNickName;
}
