package com.dinnertime.peaktime.domain.group.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dinnertime.peaktime.domain.group.entity.Group;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface GroupRepository extends JpaRepository<Group,Long> {
    // 삭제되지 않은 group만 전체 조회
    List<Group> findByIsDeleteFalse();

    @Query(value = "SELECT u.* FROM users u JOIN users_groups ug ON u.user_id = ug.sub_user_id WHERE ug.group_id = :groupId ORDER BY u.nickname ASC", nativeQuery = true)
    List<Map<String, Object>> findChildUsers(@Param("groupId") int groupId);
}
