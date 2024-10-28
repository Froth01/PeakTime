package com.dinnertime.peaktime.domain.group.service.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class GroupListResponseDto {

    private Long groupId;
    private String groupName;
    private List<ChildUserResponseDto> childList;

    @Builder
    public GroupListResponseDto(Long groupId, String groupName, List<ChildUserResponseDto> childList) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.childList = childList;
    }
}
