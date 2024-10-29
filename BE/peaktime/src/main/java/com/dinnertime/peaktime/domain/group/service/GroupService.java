package com.dinnertime.peaktime.domain.group.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupItemResponseDto;
import com.dinnertime.peaktime.domain.group.service.dto.response.ChildItemResponseDto;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;

    public List<GroupItemResponseDto> getGroupList() {
        List<Group> groupList = groupRepository.findByIsDeleteFalseOrderByTitleAsc();

        return groupList.stream()
                .map(groupItem -> {
                    return GroupItemResponseDto.builder()
                            .groupId(groupItem.getGroupId())
                            .groupTitle(groupItem.getTitle())
                            .childList(getChildList(groupItem.getGroupId()))
                            .build();
                })
                .collect(Collectors.toList());
        }

    public List<ChildItemResponseDto> getChildList(Long groupId) {
        List<UserGroup> userGroups = groupRepository.findByGroupId(groupId);

        return userGroups.stream()
                .sorted(Comparator.comparing(userGroup -> userGroup.getUser().getNickname())) // nickname 오름차순 정렬
                .map(userGroup -> {
                    return ChildItemResponseDto.builder()
                            .userId(userGroup.getUser().getUserId())
                            .userLoginId(userGroup.getUser().getUserLoginId())
                            .nickname(userGroup.getUser().getNickname())
                            .build();
                })
                .collect(Collectors.toList());
    }


// 개별 그룹 조회
    public Optional<Group> getGroupById(Long groupId) {
        return groupRepository.findById(groupId);
    }
}
