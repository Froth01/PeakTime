package com.dinnertime.peaktime.domain.group.service.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class GroupListResponseDto {

    private Long groupId;
    private String groupName;
    private List<SubUserResponseDto> subUserList;

    public GroupListResponseDto(Long groupId, String groupName, List<SubUserResponseDto> subUserList) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.subUserList = subUserList;
    }
}
