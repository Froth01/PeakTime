package com.dinnertime.peaktime.domain.timer.repository;

import com.dinnertime.peaktime.domain.timer.entity.QTimer;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
@RequiredArgsConstructor
public class TimerRepositoryImpl implements TimerRepositoryCustom {

    private final EntityManager entityManager;

    @Override
    public Boolean existsOverlappingTimers (Long groupId, LocalDateTime startTime, int attentionTime, int repeatDay) {
        LocalDateTime requestEndTime = startTime.plusMinutes(attentionTime);

        int repeatDayNumber = (repeatDay == 0) ? (int) Math.pow(2, 7 - startTime.getDayOfWeek().getValue()) : repeatDay;

        String query = "SELECT COUNT(*) FROM timers t " +
                "WHERE t.group_id = :groupId " +
                "AND t.start_time <= :requestEndTime " +
                "AND (t.start_time + INTERVAL '1 minute' * t.attention_time) >= :startTime " +
                "AND ( " +
                "      ((t.repeat_day & :repeatDayNumber) != 0) " + // 요일이 설정된 경우
                "      OR " +
                "      (t.repeat_day = 0 AND (1 << (CASE WHEN EXTRACT(DOW FROM t.start_time) = 0 THEN 0 ELSE 7 - CAST(EXTRACT(DOW FROM t.start_time) AS INTEGER) END)) & :repeatDayNumber != 0) " +
                "    )";

        Long count = (Long) entityManager.createNativeQuery(query)
                .setParameter("groupId", groupId)
                .setParameter("requestEndTime", requestEndTime)
                .setParameter("startTime", startTime)
                .setParameter("repeatDayNumber", repeatDayNumber)
                .getSingleResult();

        return count > 0; // 중복된 시간대의 타이머가 존재하면 true 반환
    }
}
