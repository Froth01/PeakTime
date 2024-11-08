package com.dinnertime.peaktime.domain.user.controller;

import com.dinnertime.peaktime.domain.user.service.UserService;
import com.dinnertime.peaktime.domain.user.service.dto.request.UpdateNicknameRequest;
import com.dinnertime.peaktime.domain.user.service.dto.request.UpdatePasswordRequest;
import com.dinnertime.peaktime.domain.user.service.dto.response.GetProfileResponse;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.util.CommonSwaggerResponse;
import com.dinnertime.peaktime.global.util.ResultDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    // 닉네임 변경
    @Operation(summary = "닉네임 변경", description = "닉네임 변경하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "닉네임 수정 요청에 성공하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "400", description = "닉네임 형식이 올바르지 않습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "401", description = "유효하지 않은 토큰입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않은 유저입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "409", description = "현재와 동일한 닉네임입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "닉네임 수정 요청에 실패하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @PutMapping("/nickname")
    public ResponseEntity<?> updateNickname(@RequestBody @Valid UpdateNicknameRequest updateNicknameRequest, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        userService.updateNickname(updateNicknameRequest, userPrincipal);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResultDto.res(HttpStatus.OK.value(),
                        "닉네임 수정 요청에 성공하였습니다."));
    }

    // 회원탈퇴
    @Operation(summary = "회원탈퇴", description = "회원탈퇴하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원탈퇴 요청에 성공하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "401", description = "유효하지 않은 토큰입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 유저입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "회원탈퇴 요청에 실패하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @DeleteMapping("")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        userService.deleteUser(userPrincipal);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResultDto.res(HttpStatus.OK.value(),
                        "회원탈퇴 요청에 성공하였습니다."));
    }

    // 비밀번호 변경
    @Operation(summary = "비밀번호 변경", description = "비밀번호 변경하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "비밀번호 변경 요청에 성공하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 형식의 요청입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "401", description = "유효하지 않은 토큰입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 유저입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "409", description = "현재와 동일한 비밀번호입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "비밀번호 변경 요청에 실패하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody @Valid UpdatePasswordRequest updatePasswordRequest, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        userService.updatePassword(updatePasswordRequest, userPrincipal);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResultDto.res(HttpStatus.OK.value(),
                        "비밀번호 변경 요청에 성공하였습니다."));
    }

}
