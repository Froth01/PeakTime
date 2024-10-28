package com.dinnertime.peaktime.domain.usergroup.entity;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "users_groups")
public class UserGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_group_id")
    private Long UserGroupId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="child_user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="group_id")
    private Group group;

    @Builder
    private UserGroup(User user, Group group) {
        this.user = user;
        this.group = group;
    }

    public static UserGroup createUserGroup(User user, Group group) {
        return UserGroup.builder()
                .user(user)
                .group(group)
                .build();
    }
}
