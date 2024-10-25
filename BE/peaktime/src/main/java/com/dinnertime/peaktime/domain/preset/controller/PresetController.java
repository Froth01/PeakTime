package com.dinnertime.peaktime.domain.preset.controller;

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

import java.nio.file.attribute.UserPrincipal;

@Slf4j
@RestController
@RequestMapping("/presets")
@RequiredArgsConstructor
public class PresetController {

    // 프리셋 조회
    @Operation(summary = "프리셋 전체 조회", description = "프리셋 전체 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프리셋 전체 조회에 성공했습니다.",
                content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "프리셋 전체 조회에 실패했습니다.",
                content= @Content(schema= @Schema(implementation = ResultDto.class))
            )

    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping
    public ResponseEntity<?> getPreset(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("getPreset 메서드가 호출되었습니다.");
        // 임시 세팅
        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"프리셋 전체 조회에 성공했습니다."));
    }

}
