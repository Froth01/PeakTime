package com.dinnertime.peaktime.domain.hiking.controller;

import com.dinnertime.peaktime.domain.hiking.service.dto.HikingService;
import com.dinnertime.peaktime.domain.hiking.service.dto.request.EndHikingRequestDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.request.StartHikingRequestDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.response.StartHikingResponseDto;
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
@RequiredArgsConstructor
@RequestMapping("/hikings")
public class HikingController {

    private final HikingService hikingService;

    @Operation(summary = "하이킹 시작", description = "하이킹 시작하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "하이킹을 시작하는데 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = StartHikingResponseDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "집중 시간은 최대 4시간을 초과 할 수 없습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "하이킹을 시작하는데 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )

    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping
    public ResponseEntity<?> startHiking(/*@AuthenticationPrincipal UserPrincipal userPrincipal, */@RequestBody @Valid StartHikingRequestDto requestDto) {
        StartHikingResponseDto responseDto = hikingService.startHiking(/*userPrincipal.getUserId(), */ requestDto);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "하이킹을 시작하는데 성공하였습니다.", responseDto));
    }

    @Operation(summary = "하이킹 종료", description = "하이킹 종료하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "하이킹을 종료하는데 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "컨텐츠 타입은 'program' 또는 'site' 여야 합니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "403", description = "자식 계정은 하이킹 중 종료 할 수 없습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "하이킹을 종료하는데 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )

    })
    @CommonSwaggerResponse.CommonResponses
    @PutMapping("/{hiking-id}")
    public ResponseEntity<?> endHiking(/*@AuthenticationPrincipal UserPrincipal userPrincipal, */@RequestBody @Valid EndHikingRequestDto requestDto, @PathVariable("hiking-id") Long hikingId) {
        hikingService.endHiking(/*userPrincipal.getUserId(), */ requestDto, hikingId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "하이킹을 종료하는데 성공하였습니다."));
    }
}
