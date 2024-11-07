package com.dinnertime.peaktime.domain.user.controller;

import com.dinnertime.peaktime.domain.user.service.UserService;
import com.dinnertime.peaktime.domain.user.service.dto.response.GetProfileResponse;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.util.CommonSwaggerResponse;
import com.dinnertime.peaktime.global.util.ResultDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 프로필 조회
    @Operation(summary = "프로필 조회", description = "프로필 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프로필 조회 요청에 성공하였습니다.",
                    content = @Content(schema = @Schema(implementation = GetProfileResponse.class))),
            @ApiResponse(responseCode = "401", description = "유효하지 않은 토큰입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않은 유저입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "프로필 조회 요청에 실패하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping("")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        GetProfileResponse response = userService.getProfile(userPrincipal);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResultDto.res(HttpStatus.OK.value(),
                        "프로필 조회 요청에 성공하였습니다.", response));
    }

}
