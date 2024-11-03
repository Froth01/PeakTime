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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/children")
public class ChildController {

    private final ChildService childService;

    @Operation(summary = "자식 계정 생성", description = "루트 유저가 자식 계정을 생성")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "자식 계정 생성에 성공하였습니다.",
            content = {@Content(schema = @Schema(implementation = Filter.Result.class))}),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 계정입니다.",
                    content = {@Content(schema = @Schema(implementation = Filter.Result.class))}),
            @ApiResponse(responseCode = "500", description = "자식 계정 생성에 실패하였습니다.",
                    content = {@Content(schema = @Schema(implementation = Filter.Result.class))})
    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping("")
    public ResponseEntity<?> createChild(@Valid @RequestBody CreateChildRequestDto requestDto){

        childService.

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResultDto.res(HttpStatus.OK.value(), "자식 계정 생성에 성공하였습니다."));
    }
}
