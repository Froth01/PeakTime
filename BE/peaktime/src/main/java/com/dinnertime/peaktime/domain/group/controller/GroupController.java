package com.dinnertime.peaktime.domain.group.controller;

import com.dinnertime.peaktime.domain.group.service.GroupService;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupListResponseDto;
import com.dinnertime.peaktime.global.util.ResultDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Map;

@RestController
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

//    그룹 전체 조회
    @GetMapping("/groups")
    public ResponseEntity<ResultDto<Map<String, List<GroupListResponseDto>>>> getAllGroups() {
        try {
            List<GroupListResponseDto> groupList = groupService.getAllGroups();
            Map<String, List<GroupListResponseDto>> groupListAsMap = groupService.getGroupListAsMap(groupList);
            return ResponseEntity.ok(ResultDto.res(200, "그룹 및 서브유저 전체 조회 성공하였습니다.", groupListAsMap));
        } catch (HttpClientErrorException.BadRequest e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResultDto.res(400, "잘못된 요청입니다."));
        } catch (HttpClientErrorException.NotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResultDto.res(404, "존재하지 않는 페이지입니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResultDto.res(500, "그룹을 조회하는 데 실패했습니다."));
        }
    }

//    그룹 생성
    @PostMapping("/groups")
    public void postGroup() {
        System.out.println("postGroup");
        return;
    }

//    그룹 조회
    @GetMapping("/groups/{groupId}")
    public void getGroup() {
        System.out.println("getGroup");
        return;
    }

//    그룹 수정
    @PutMapping("/groups/{groupId}")
    public void putGroup() {
        System.out.println("putGroup");
        return;
    }

//    그룹 삭제
    @DeleteMapping("/groups/{groupId}")
    public void deleteGroup() {
        System.out.println("deleteGroup");
        return;
    }

}
