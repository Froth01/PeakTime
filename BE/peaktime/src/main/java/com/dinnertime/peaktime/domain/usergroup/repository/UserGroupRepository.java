package com.dinnertime.peaktime.domain.usergroup.repository;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {
    List<UserGroup> findAllByGroup(Group group);

    // 그룹에 존재하는 유저 수
    Long countAllByGroup(Group group);
    // 그룹에 존재하는 유저 수 -> 본인 제외
    Long countAllByGroupAndUserNot(Group group, User user);

    // 자식 계정에 대한 user_group
    Optional<UserGroup> findByUser_UserId(Long userId);

}
