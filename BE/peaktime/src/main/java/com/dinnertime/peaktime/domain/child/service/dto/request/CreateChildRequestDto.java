package com.dinnertime.peaktime.domain.child.service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;

@Getter
@ToString
public class CreateChildRequestDto {

    @NotNull
    private Long groupId;
    @NotBlank
    @Length(min = 5, max = 15, message = "5자 이상 15자 이하의 아이디를 입력해주세요.")
    private String childLoginId;
    @NotBlank
    @Length(min = 8, message = "최소 8자 이상의 패스워드를 입력해주세요.")
    private String childPassword;
    @NotBlank
    @Length(min = 2, max = 20, message = "2자 이상 20자 이하의 닉네임을 입력주세요.")
    private String childNickname;
}
