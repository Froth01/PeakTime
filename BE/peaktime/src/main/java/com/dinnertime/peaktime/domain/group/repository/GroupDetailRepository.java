package com.dinnertime.peaktime.domain.group.repository;

import com.dinnertime.peaktime.domain.group.entity.Group;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupDetailRepository extends JpaRepository<Group, Long> {

    // groupId로 group 조회
    Optional<Group> findByGroupIdAndIsDelete(Long groupId, Boolean isDelete);
}