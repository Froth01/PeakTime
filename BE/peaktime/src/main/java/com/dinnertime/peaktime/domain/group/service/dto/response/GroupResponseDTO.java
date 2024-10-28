package com.dinnertime.peaktime.domain.group.service.dto.response;

import com.dinnertime.peaktime.domain.group.entity.Group;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GroupResponseDTO {

    private Long groupId;
    private String groupName;
    private Boolean isDelete;

    public GroupResponseDTO(Group group) {
        this.groupId = group.getGroupId();
        this.groupName = group.getTitle();
        this.isDelete = group.isDelete();
    }
}
