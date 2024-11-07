package com.dinnertime.peaktime.domain.summary.repository;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import com.dinnertime.peaktime.domain.summary.entity.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SummaryRepository extends JpaRepository<Summary, Long> {

    // 요약 단독 삭제 시 사용하기 위함
    Optional<Summary> findBySummaryId(Long summaryId);

    Summary findByMemo_MemoId(Long momoId);

}
