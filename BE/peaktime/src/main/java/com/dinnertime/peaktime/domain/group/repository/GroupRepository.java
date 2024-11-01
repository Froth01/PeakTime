package com.dinnertime.peaktime.domain.group.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dinnertime.peaktime.domain.group.entity.Group;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    
    // 그룹 전체 조회
    // 삭제되지 않은 group만 전체 조회
    // List<Group> findByIsDeleteFalseAndRootUserId(@Param("rootUserId") Long rootUserId);
    List<Group> findByIsDeleteOrderByTitleAsc(Boolean isDelete);

    // 그룹 조회
    // groupId로 group 조회
    Optional<Group> findByGroupIdAndIsDelete(Long groupId, Boolean isDelete);

    // 그룹 생성 전 그룹 수 조회
    List<Group> findByUser_UserIdAndIsDelete(Long userId, Boolean isDelete);
}
