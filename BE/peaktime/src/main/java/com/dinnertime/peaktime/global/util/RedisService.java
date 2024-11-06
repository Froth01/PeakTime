package com.dinnertime.peaktime.global.util;

import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import com.dinnertime.peaktime.domain.schedule.service.dto.RedisSchedule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisService {
    private final RedisTemplate<String, String> stringRedisTemplate;
    private final RedisTemplate<String, List<RedisSchedule>> scheduleRedisTemplate;

    public boolean checkTimerByGroupId(Long groupId, int start, int end) {
        //키는 timer:그룹아이디
        String key = "timer:"+groupId;

        ZSetOperations<String, String> zSet = stringRedisTemplate.opsForZSet();

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
        ZSetOperations<String, String> zSet = stringRedisTemplate.opsForZSet();

        //key에 해당하는 score(start시간) 중 겹치는 것을 확인
        //최대 4시간 집중할 수 있으므로 시작시간 - 240부터 end시간까지 중 시작시간이 것을 확인
        //
        Set<String> checkRange = zSet.rangeByScore(key, start-240, end);

        zSet.add(key, start + "-" + end+"-"+groupId, start);
    }

    public void deleteTimerByGroupIdAndTime(Long groupId, int start, int end) {
        String key = "timer:"+groupId;
        ZSetOperations<String, String> zSet = stringRedisTemplate.opsForZSet();

        zSet.remove(key, start +"-"+end+"-"+groupId);
    }

    //현재 시간을 가져와서 보내주기
    public List<String> findTimerByStart(int start) {

        // "timer:"로 시작하는 모든 키 가져오기
        ZSetOperations<String, String> zSet = stringRedisTemplate.opsForZSet();
        Set<String> keys = stringRedisTemplate.keys("timer:*");

        // 각 키에서 해당 score에 해당하는 요소만 가져오기
        Set<String> elements = new HashSet<>();
        for (String key : keys) {
            Set<String> matchedElements = zSet.rangeByScore(key, start, start);
            elements.addAll(matchedElements);
        }

        if(elements.isEmpty()) {
            return null;
        }

        return elements.stream().toList();
    }

    public void addSchedule(Schedule schedule) {
        // 1. 오늘 날짜 키 생성 (예: "schedule:2024-11-04")
        String cacheKey = "schedule:"+ LocalDate.now();

        RedisSchedule saveSchedule = RedisSchedule.createRedisSchedule(schedule);

        // 2. Redis에서 스케줄을 조회
        List<RedisSchedule> scheduleList = scheduleRedisTemplate.opsForValue().get(cacheKey);

        List<RedisSchedule> copyScheduleList = new ArrayList<>();

        if(scheduleList != null) {
            Long ttl = scheduleRedisTemplate.getExpire(cacheKey);
            copyScheduleList = new ArrayList<>(scheduleList);
            //불변 객체일 경우가 있으므로 복사
            copyScheduleList.add(saveSchedule);

            //레디스에 저장 만료일은 자정12시
            scheduleRedisTemplate.opsForValue().set(cacheKey, copyScheduleList, ttl);
            return;
        }

        //불변 객체일 경우가 있으므로 복사
        copyScheduleList.add(saveSchedule);

        //내일 정각 시간 
        LocalDateTime midnight = LocalDate.now().plusDays(1).atStartOfDay();

        //현재시간을 기준으로 자정까지 남은 초
        Long ttl = Duration.between(LocalDateTime.now(), midnight).getSeconds();

        //레디스에 저장 만료일은 자정12시
        scheduleRedisTemplate.opsForValue().set(cacheKey, copyScheduleList, ttl);
    }

    public void addFirstSchedule(List<Schedule> scheduleList) {
        // 1. 오늘 날짜 키 생성 (예: "schedule:2024-11-04")
        String cacheKey = "schedule:"+ LocalDate.now();

        // 2. Redis에서 스케줄을 조회
        List<RedisSchedule> redisScheduleList = scheduleList.stream()
                .map(RedisSchedule::createRedisSchedule)
                        .toList();

        //레디스에 저장 만료일은 자정12시
        scheduleRedisTemplate.opsForValue().set(cacheKey, redisScheduleList, Duration.ofDays(1));
    }

}