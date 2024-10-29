package com.dinnertime.peaktime.domain.group.controller;

import com.dinnertime.peaktime.domain.group.service.GroupService;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupListResponseDto;
import com.dinnertime.peaktime.global.util.CommonSwaggerResponse;
import com.dinnertime.peaktime.global.util.ResultDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

//    그룹 전체 조회
    @Operation(summary = "그룹 전체 정보 조회", description = "루트 유저의 전체 그룹 정보 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "그룹 및 서브유저 전체 조회 성공하였습니다.",
                    content = @Content(schema = @Schema(implementation = GroupListResponseDto.class))),
            @ApiResponse(responseCode = "500", description = "그룹을 조회하는 데 실패하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping("")
    public ResponseEntity<?> getGroupList() {
        GroupListResponseDto groupListResponseDto = GroupListResponseDto.builder()
                            .groupList(groupService.getGroupList())
                            .build();

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "그룹 및 서브유저 전체 조회 성공하였습니다.", groupListResponseDto));
    }

//    그룹 생성
    @PostMapping("")
    public void postGroup() {
        System.out.println("postGroup");
        return;
    }

//    그룹 조회
    @GetMapping("/{groupId}")
    public void getGroup() {
        System.out.println("getGroup");
        return;
    }

//    그룹 수정
    @PutMapping("/{groupId}")
    public void putGroup() {
        System.out.println("putGroup");
        return;
    }

//    그룹 삭제
    @DeleteMapping("/{groupId}")
    public void deleteGroup() {
        System.out.println("deleteGroup");
        return;
    }

}
