package com.dinnertime.peaktime.domain.child.controller;

import com.dinnertime.peaktime.domain.child.service.ChildService;
import com.dinnertime.peaktime.domain.child.service.dto.request.CreateChildRequestDto;
import com.dinnertime.peaktime.global.util.CommonSwaggerResponse;
import com.dinnertime.peaktime.global.util.ResultDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.core.Filter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/children")
public class ChildController {

    private final ChildService childService;

    @Operation(summary = "자식 계정 생성", description = "루트 유저가 자식 계정을 생성")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "자식 계정 생성에 성공하였습니다.",
            content = {@Content(schema = @Schema(implementation = ResultDto.class))}),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 계정입니다.",
                    content = {@Content(schema = @Schema(implementation = ResultDto.class))}),
            @ApiResponse(responseCode = "422", description = "그룹에는 최대 30명의 자식 계정만 존재할 수 있습니다.",
                    content = {@Content(schema = @Schema(implementation = ResultDto.class))}),
            @ApiResponse(responseCode = "500", description = "자식 계정 생성에 실패하였습니다.",
                    content = {@Content(schema = @Schema(implementation = ResultDto.class))})
    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping("")
    public ResponseEntity<?> createChild(@Valid @RequestBody CreateChildRequestDto requestDto){

        childService.createChild(1L, requestDto);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResultDto.res(HttpStatus.OK.value(), "자식 계정 생성에 성공하였습니다."));
    }

    @Operation(summary = "자식 계정 삭제", description = "루트 유저가 자식 계정을 삭제")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "자식 계정 삭제에 성공하였습니다.",
            content = {@Content(schema = @Schema(implementation = ResultDto.class))}),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 계정입니다.",
                    content = {@Content(schema = @Schema(implementation = ResultDto.class))}),
            @ApiResponse(responseCode = "500", description = "자식 계정 삭제에 실패하였습니다.",
            content = {@Content(schema = @Schema(implementation = ResultDto.class))})
    })
    @CommonSwaggerResponse.CommonResponses
    @DeleteMapping("/{child-id}")
    public ResponseEntity<?> deleteChild(@PathVariable("child-id") Long childId){

        childService.deleteChild(1L, childId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResultDto.res(HttpStatus.OK.value(), "자식 계정 삭제에 성공하였습니다."));
    }
}
