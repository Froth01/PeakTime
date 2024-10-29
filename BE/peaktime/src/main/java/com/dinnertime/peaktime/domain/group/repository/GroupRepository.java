package com.dinnertime.peaktime.domain.group.repository;

import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dinnertime.peaktime.domain.group.entity.Group;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    // 삭제되지 않은 group만 전체 조회
    // List<Group> findByIsDeleteFalseAndRootUserId(@Param("rootUserId") Long rootUserId);
    List<Group> findByIsDeleteOrderByTitleAsc(Boolean isDelete);
}
