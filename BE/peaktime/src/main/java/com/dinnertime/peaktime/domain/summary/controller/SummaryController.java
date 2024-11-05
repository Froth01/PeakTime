package com.dinnertime.peaktime.domain.summary.controller;

import com.dinnertime.peaktime.domain.memo.service.MemoService;
import com.dinnertime.peaktime.domain.summary.service.SummaryFacade;
import com.dinnertime.peaktime.domain.summary.service.SummaryService;
import com.dinnertime.peaktime.domain.summary.service.dto.request.SaveSummaryRequestDto;
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
@RequestMapping("/summaries")
@RequiredArgsConstructor
public class SummaryController {

    private final SummaryFacade summaryFacade;

    // 요약 저장
    @Operation(summary = "gpt 요약 내용 저장하기", description = "메모당 요약내용 새롭게 저장하고 업데이트하기")
    @ApiResponses(value ={
            @ApiResponse(responseCode = "200", description = "요청된 요약 내용 저장 또는 수정에 성공했습니다.",
            content=@Content(schema = @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "요청된 요약 내용 저장 또는 수정에 실패했습니다.",
            content=@Content(schema = @Schema(implementation = ResultDto.class))
            ),
    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping()
    public ResponseEntity<?> createSummary(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody SaveSummaryRequestDto requestDto) {

        log.info("createSummary 메서드가 호출되었습니다.");
        log.info("요약 생성 : " + requestDto.toString());

        summaryFacade.createOrUpdateSummary(requestDto);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "요약 생성 및 수정에 성공했습니다."));

    }


    // 요약 삭제
    @Operation(summary = "저장된 요약 삭제하기", description = "요약 내용 삭제하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "요약 내용 삭제에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "요약 내용 삭제에 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )

    })
    @CommonSwaggerResponse.CommonResponses
    @DeleteMapping("/{summaryId}")
    public ResponseEntity<?> deleteSummary(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long summaryId) {


        log.info("deleteSummary  메서드가 호출되었습니다.");

        summaryFacade.deleteSummary(summaryId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"프리셋 삭제에 성공했습니다."));
    }

}
