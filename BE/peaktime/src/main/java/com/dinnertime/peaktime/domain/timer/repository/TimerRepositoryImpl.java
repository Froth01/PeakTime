package com.dinnertime.peaktime.domain.timer.repository;

import com.dinnertime.peaktime.domain.timer.entity.QTimer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Slf4j
@Repository
@RequiredArgsConstructor
public class TimerRepositoryImpl implements TimerRepositoryCustom {

    private final EntityManager entityManager;

    @Override
    public Boolean existsOverlappingTimers (Long groupId, LocalDateTime startTime, int attentionTime, int repeatDay) {
        LocalDateTime requestEndTime = startTime.plusMinutes(attentionTime);

        QTimer timer = QTimer.timer;

        String query = "SELECT COUNT(*) FROM timers t " +
                "WHERE t.group_id = :groupId " +
                "AND t.start_time <= :requestEndTime " + // DB data의 start_time이 request의 end_time보다 이른 것
                "AND (t.start_time + INTERVAL '1 minute' * t.attention_time) >= :startTime " + // DB data의 end_time이 request의 start_time보다 늦는 것
                "AND (t.repeat_day = 0 OR (t.repeat_day & :repeatDay) != 0)"; // 반복하지 않는 타이머나, 반복하면서 요일이 겹치는 타이머 조회

        Long count = (Long) entityManager.createNativeQuery(query)
                .setParameter("groupId", groupId)
                .setParameter("requestEndTime", requestEndTime)
                .setParameter("startTime", startTime)
                .setParameter("repeatDay", repeatDay)
                .getSingleResult();

        return count > 0; // 중복된 시간대의 타이머가 존재하면 true 반환
    }
}
