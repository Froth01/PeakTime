package com.dinnertime.peaktime.domain.timer.repository;

import com.dinnertime.peaktime.domain.timer.entity.QTimer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Repository
@RequiredArgsConstructor
public class TimerRepositoryImpl implements TimerRepositoryCustom {

    @PersistenceContext
    private final EntityManager entityManager;

    @Override
    public Boolean existsOverlappingTimers (Long groupId, LocalDateTime startTime, int attentionTime, int[] repeatDay) {
        LocalDateTime requestEndTime = startTime.plusMinutes(attentionTime);

        QTimer timer = QTimer.timer;
        Boolean isRepeatDayAllZero = isRepeatDayAllZero(repeatDay);

        String query = "SELECT COUNT(*) FROM timers t " +
                "WHERE t.group_id = :groupId " +
                "AND t.start_time <= :requestEndTime " + // DB data의 start_time이 request의 end_time보다 이른 것
                "AND (t.start_time + INTERVAL '1 minute' * t.attention_time) >= :startTime " + // DB data의 end_time이 request의 start_time보다 늦는 것
                "AND (:isRepeatDayAllZero = true OR t.repeat_day && :repeatDay)"; // is_repeat = false거나 혹은 repeat_day가 겹치는 것이 존재할 경우

        Long count = (Long) entityManager.createNativeQuery(query)
                .setParameter("groupId", groupId)
                .setParameter("requestEndTime", requestEndTime)
                .setParameter("startTime", startTime)
                .setParameter("isRepeatDayAllZero", isRepeatDayAllZero)
                .setParameter("repeatDay", repeatDay)
                .getSingleResult();
        return count > 0; // 중복된 시간대가 존재하면 true 반환
    }

    private Boolean isRepeatDayAllZero(int[] repeatDay) {
        for (int day : repeatDay) {
            if (day != 0) {
                return false;
            }
        }
        return true;
    }

    @Override
    public Long updateRepeatDayByTimerId(Long timerId) {
        String selectQuery = "SELECT repeat_day FROM timers WHERE timer_id = :timerId";
        int[] repeatDay = (int[]) entityManager.createNativeQuery(selectQuery)
                .setParameter("timerId", timerId)
                .getSingleResult();

        int todayIndex = LocalDate.now().getDayOfWeek().getValue() - 1;
        repeatDay[todayIndex] = 0;

        String query = "UPDATE timers SET repeat_day = :repeatDay WHERE timer_id = :timerId";

        return (long) entityManager.createNativeQuery(query)
                .setParameter("repeatDay", repeatDay)
                .setParameter("timerId", timerId)
                .executeUpdate();
    }
}
