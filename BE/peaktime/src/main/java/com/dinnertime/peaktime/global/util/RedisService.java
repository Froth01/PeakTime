package com.dinnertime.peaktime.global.util;

import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisService {
    private final RedisTemplate<String, String> redisTemplate;
    private final RedisTemplate<String, List<Schedule>> scheduleRedisTemplate;

    public boolean checkTimerByGroupId(Long groupId, int start, int end) {
        //키는 timer:그룹아이디
        String key = "timer:"+groupId;

        ZSetOperations<String, String> zSet = redisTemplate.opsForZSet();

        //key에 해당하는 score(start시간) 중 겹치는 것을 확인
        //최대 4시간 집중할 수 있으므로 시작시간 - 240부터 end시간까지 중 시작시간이 것을 확인
        //
        Set<String> checkRange = zSet.rangeByScore(key, start-240, end);

        // 겹치는지 검사
        //한개라도 겹치면 true
        //겹치면 true
        return checkRange != null && checkRange.stream().anyMatch(range -> {
            String[] parts = range.split("-");
            int existingStart = Integer.parseInt(parts[0]);
            int existingEnd = Integer.parseInt(parts[1]);

            log.info(existingStart + "-" + existingEnd);

            return (start < existingEnd && end > existingStart); // 겹치는지 조건 확인
        });

    }

    public void addTimerByGroupId(Long groupId, int start, int end) {
        String key = "timer:"+groupId;
        ZSetOperations<String, String> zSet = redisTemplate.opsForZSet();

        //key에 해당하는 score(start시간) 중 겹치는 것을 확인
        //최대 4시간 집중할 수 있으므로 시작시간 - 240부터 end시간까지 중 시작시간이 것을 확인
        //
        Set<String> checkRange = zSet.rangeByScore(key, start-240, end);

        zSet.add(key, start + "-" + end, start);
    }

    public void deleteTimerByGroupIdAndTime(Long groupId, int start, int end) {
        String key = "timer:"+groupId;
        ZSetOperations<String, String> zSet = redisTemplate.opsForZSet();

        zSet.remove(key, start +"-"+end);
    }

    public void addSchedule(Schedule schedule) {
        // 1. 오늘 날짜 키 생성 (예: "schedule:2024-11-04")
        String cacheKey = "schedule:"+ LocalDate.now();

        // 2. Redis에서 스케줄을 조회
        List<Schedule> scheduleList = scheduleRedisTemplate.opsForValue().get(cacheKey);
        Long ttl = scheduleRedisTemplate.getExpire(cacheKey);

        //불변 객체일 경우가 있으므로 복사
        scheduleList = new ArrayList<>(scheduleList);
        scheduleList.add(schedule);

        //레디스에 저장 만료일은 자정12시
        scheduleRedisTemplate.opsForValue().set(cacheKey, scheduleList, ttl);
    }

    public void addFirstSchedule(List<Schedule> scheduleList) {
        // 1. 오늘 날짜 키 생성 (예: "schedule:2024-11-04")
        String cacheKey = "schedule:"+ LocalDate.now();

        // 2. Redis에서 스케줄을 조회

        //레디스에 저장 만료일은 자정12시
        scheduleRedisTemplate.opsForValue().set(cacheKey, scheduleList, Duration.ofDays(1));
    }

}