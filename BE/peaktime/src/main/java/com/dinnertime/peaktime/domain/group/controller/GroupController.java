package com.dinnertime.peaktime.domain.group.controller;

import com.dinnertime.peaktime.domain.group.service.dto.GroupService;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dinnertime.peaktime.domain.group.entity.Group;

import java.util.List;

@RestController
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    //    그룹 전체 조회
    @GetMapping("/groups")
    public ResponseEntity<List<GroupResponseDTO>> getGroupList() {
        List<GroupResponseDTO> groups = groupService.getAllGroups();
        return ResponseEntity.ok(groups);
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
