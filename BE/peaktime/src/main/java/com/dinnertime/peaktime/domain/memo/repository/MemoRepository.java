package com.dinnertime.peaktime.domain.memo.repository;


import com.dinnertime.peaktime.domain.memo.entity.Memo;
import com.dinnertime.peaktime.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemoRepository extends JpaRepository<Memo, Long> {

    // 메모리스트 조회시 사용
    List<Memo> findAllByUser_UserIdOrderByMemoIdASC(Long userId);

    // 메모 상세 조회, 메모 삭제에 사용
    Optional<Memo> findByMemoId(Long memoId);
}
