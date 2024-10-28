package com.dinnertime.peaktime.domain.group.service.dto;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

//    전체 그룹 조회
    public List<GroupResponseDTO> getAllGroups() {
        return groupRepository.findAll().stream()
                .map(group -> new GroupResponseDTO(group)) // Group을 GroupResponseDTO로 변환
                .collect(Collectors.toList());
    }


// 개별 그룹 조회
    public Optional<Group> getGroupById(Long groupId) {
        return groupRepository.findById(groupId);
    }
}
