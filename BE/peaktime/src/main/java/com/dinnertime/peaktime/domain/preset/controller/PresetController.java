package com.dinnertime.peaktime.domain.preset.controller;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.preset.service.PresetService;
import com.dinnertime.peaktime.domain.preset.service.dto.request.SavePresetRequestDto;
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

import java.nio.file.attribute.UserPrincipal;

@Slf4j
@RestController
@RequestMapping("/presets")
@RequiredArgsConstructor
public class PresetController {

    private final PresetService presetService;

    // 프리셋 생성
    @Operation(summary = "프리셋 생성", description = "추가 버튼으로 프리셋 생성하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프리셋 생성에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "프리셋 생성에 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )

    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping
    public ResponseEntity<?> createPreset(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody SavePresetRequestDto requestDto) {
        //단순한 데이터 형식과 길이에 대한 유효성 검증은 컨트롤러에서 처리 @Valid
        log.info("createPreset 메서드가 호출되었습니다.");
        log.info("프리셋 생성 : " + requestDto.toString());

        presetService.createPreset(userPrincipal, requestDto);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"프리셋 생성에 성공했습니다."));
    }



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

        presetService.getPresets(userPrincipal);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"프리셋 전체 조회에 성공했습니다."));
    }

}
