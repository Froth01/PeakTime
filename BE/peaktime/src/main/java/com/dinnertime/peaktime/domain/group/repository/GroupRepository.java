package com.dinnertime.peaktime.domain.group.repository;

import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dinnertime.peaktime.domain.group.entity.Group;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    // 삭제되지 않은 group만 전체 조회
    // List<Group> findByIsDeleteFalseAndRootUserId(@Param("rootUserId") Long rootUserId);
    List<Group> findByIsDeleteFalseOrderByTitleAsc();

    // 그룹 당 유저 검색
    @Query("SELECT u FROM UserGroup u JOIN FETCH u.user WHERE u.group.id = :groupId")
    List<UserGroup> findByGroupId(@Param("groupId") Long groupId);
}
