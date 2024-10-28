package com.dinnertime.peaktime.domain.group.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupListResponseDto;
import com.dinnertime.peaktime.domain.group.service.dto.response.ChildResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    // 조회 자료를 HashMap으로 변환
    public Map<String, List<GroupListResponseDto>> getGroupListAsMap(List<GroupListResponseDto> groupList) {
        Map<String, List<GroupListResponseDto>> data = new HashMap<>();
        data.put("groupList", groupList);
        return data;
    }

    // 전체 그룹 조회
    public List<GroupListResponseDto> getAllGroups() {
        return groupRepository.findByIsDeleteFalse().stream()
                .sorted(Comparator.comparing(Group::getTitle)) // title에 따라 ASC 정렬
                .map(group -> {
                    List<Map<String, Object>> subUserData = groupRepository.findChildUsers(group.getGroupId().intValue());
                    List<ChildUserResponseDto> childUserList = subUserData.stream()
                            .map(data -> new ChildUserResponseDto(
                                    ((Long) data.get("userId")).longValue(),
                                    (String) data.get("userLoginId"),
                                    (String) data.get("nickname")
                            ))
                            .collect(Collectors.toList());

                    return new GroupListResponseDto(group.getGroupId(), group.getTitle(), childUserList);
                })
                .collect(Collectors.toList());
    }


// 개별 그룹 조회
    public Optional<Group> getGroupById(Long groupId) {
        return groupRepository.findById(groupId);
    }
}
