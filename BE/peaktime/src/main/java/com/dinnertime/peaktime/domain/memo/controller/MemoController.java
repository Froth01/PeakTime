package com.dinnertime.peaktime.domain.memo.controller;

import com.dinnertime.peaktime.domain.memo.service.MemoService;
import com.dinnertime.peaktime.domain.memo.service.dto.response.MemoSummaryResponseDto;
import com.dinnertime.peaktime.domain.memo.service.dto.response.MemoWrapperResponseDto;
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
import org.springframework.web.bind.annotation.*;

import java.nio.file.attribute.UserPrincipal;

@Slf4j
@RestController
@RequestMapping("/memos")
@RequiredArgsConstructor
public class MemoController {

    private final MemoService memoService;

    // 메모 리스트 조회
    @Operation(summary = "메모 리스트 조회", description = "화면 진입 시 메모의 리스트를 확인함")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "메모 리스트 조회에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "메모 리시트 조회에 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping
    public ResponseEntity<?> getMemoTitles (@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("getMemoTitles 메서드가 호출되었습니다.");

        MemoWrapperResponseDto responseDto = memoService.getMemos(userPrincipal);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"메모 리스트 조회에 성공했습니다.", responseDto));
    }



    // 메모 및 요약 상세 조회
    // 메모 리스트 조회
    @Operation(summary = "메모 및 요약 상세 조회", description = "메모 리스트 내 타이틀 클릭시 발생하는 상세 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "메모 및 요약 상세 조회에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "메모 및 요약 상세 조회에 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping("/{memoId}")
    public ResponseEntity<?> getMemoDetail (
            @AuthenticationPrincipal UserPrincipal userPrincipal
            ,@PathVariable("memoId") Long memoId) {
        log.info("getMemoDetail 메서드가 호출되었습니다.");

        MemoSummaryResponseDto responseDto = memoService.getDetailedMemo(userPrincipal, memoId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"메모 및 요약 상세 조회에 성공했습니다.", responseDto));
    }

    // 메모 삭제
    @Operation(summary = "메모 삭제", description = "저장된 메모를 삭제함")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "메모 삭제에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "메모 삭제에 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @DeleteMapping("/{memoId}")
    public ResponseEntity<?> deleteMemo(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long memoId) {
        log.info("deleteMemo 메서드가 호출되었습니다.");

        memoService.deleteMemo(userPrincipal, memoId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"메모 삭제에 성공했습니다."));
    }

}
