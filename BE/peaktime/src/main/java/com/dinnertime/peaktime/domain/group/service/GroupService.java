package com.dinnertime.peaktime.domain.group.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupItemResponseDto;
import com.dinnertime.peaktime.domain.group.service.dto.response.ChildItemResponseDto;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupListResponseDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserGroupRepository userGroupRepository;

    @Transactional
    public GroupListResponseDto getGroupListResponseDto() {
        List<GroupItemResponseDto> groupList = getGroupList();

        return GroupListResponseDto.createGroupListResponseDto(groupList);
    }

    @Transactional
    public List<GroupItemResponseDto> getGroupList() {
        List<Group> groupList = groupRepository.findByIsDeleteOrderByTitleAsc(false);

        return groupList.stream()
                .map(groupItem -> GroupItemResponseDto.createGroupItemResponseDto(
                        groupItem.getGroupId(),
                        groupItem.getTitle(),
                        getChildList(groupItem)
                ))
                .collect(Collectors.toList());
        }

    @Transactional
    public List<ChildItemResponseDto> getChildList(Group group) {
        List<UserGroup> userGroups = userGroupRepository.findAllByGroup(group);

        return userGroups.stream()
                .sorted(Comparator.comparing(userGroup -> userGroup.getUser().getNickname())) // nickname 오름차순 정렬
                .map(userGroup -> {
                    User user = userGroup.getUser();

                    return ChildItemResponseDto.createChildItemResponseDto(
                            user.getUserId(),
                            user.getUserLoginId(),
                            user.getNickname()
                    );
                })
                .collect(Collectors.toList());
    }


// 개별 그룹 조회
    public Optional<Group> getGroupById(Long groupId) {
        return groupRepository.findById(groupId);
    }
}
