package com.dinnertime.peaktime.global.auth.controller;

import com.dinnertime.peaktime.global.auth.service.AuthService;
import com.dinnertime.peaktime.global.auth.service.dto.request.LoginRequest;
import com.dinnertime.peaktime.global.auth.service.dto.request.SignupRequest;
import com.dinnertime.peaktime.global.auth.service.dto.response.IsDuplicatedResponse;
import com.dinnertime.peaktime.global.auth.service.dto.response.LoginResponse;
import com.dinnertime.peaktime.global.auth.service.dto.response.ReissueResponse;
import com.dinnertime.peaktime.global.util.CommonSwaggerResponse;
import com.dinnertime.peaktime.global.util.ResultDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 회원가입
    @Operation(summary = "회원가입", description = "회원가입하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원가입에 성공하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 형식의 요청입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "409", description = "이미 존재하는 아이디입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "일시적인 오류로 회원가입을 할 수 없습니다. 잠시 후 다시 이용해 주세요.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid SignupRequest signupRequest) {
        authService.signup(signupRequest);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResultDto.res(HttpStatus.OK.value(),
                        "회원가입에 성공하였습니다."));
    }

    // 유저 로그인 아이디 중복 조회
    @Operation(summary = "유저 로그인 아이디 중복 조회", description = "유저 로그인 아이디 중복 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "유저 로그인 아이디 중복 조회 요청에 성공하였습니다.",
                    content = @Content(schema = @Schema(implementation = IsDuplicatedResponse.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 형식의 요청입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "유저 로그인 아이디 중복 조회 요청에 실패하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping("/user-login-id")
    public ResponseEntity<?> isDuplicatedUserLoginId(@RequestParam(value = "userLoginId") String userLoginId) {
        IsDuplicatedResponse response = authService.isDuplicatedUserLoginId(userLoginId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResultDto.res(HttpStatus.OK.value(),
                        "유저 로그인 아이디 중복 조회 요청에 성공하였습니다.", response));
    }

    // 이메일 중복 조회
    @Operation(summary = "이메일 중복 조회", description = "이메일 중복 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이메일 중복 조회 요청에 성공하였습니다.",
                    content = @Content(schema = @Schema(implementation = IsDuplicatedResponse.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 형식의 요청입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "이메일 중복 조회 요청에 실패하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping("/email")
    public ResponseEntity<?> isDuplicatedEmail(@RequestParam(value = "email") String email) {
        IsDuplicatedResponse response = authService.isDuplicatedEmail(email);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResultDto.res(HttpStatus.OK.value(),
                        "이메일 중복 조회 요청에 성공하였습니다.", response));
    }

    // 로그인
    @Operation(summary = "로그인", description = "로그인하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인에 성공하였습니다.",
                    content = @Content(schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 형식의 요청입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "404", description = "등록되지 않은 아이디이거나 아이디 또는 비밀번호를 잘못 입력했습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "일시적인 오류로 로그인을 할 수 없습니다. 잠시 후 다시 이용해 주세요.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse httpServletResponse) {
        LoginResponse response = authService.login(loginRequest, httpServletResponse);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResultDto.res(HttpStatus.OK.value(),
                        "로그인에 성공하였습니다.", response));
    }

    // Reissue JWT
    @PostMapping("/token/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        ReissueResponse response = authService.reissue(httpServletRequest, httpServletResponse);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResultDto.res(HttpStatus.OK.value(),
                        "JWT가 재발급되었습니다.", response));
    }

}
