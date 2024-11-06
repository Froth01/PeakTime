package com.dinnertime.peaktime.global.util;

import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import com.dinnertime.peaktime.domain.schedule.service.dto.RedisSchedule;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

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

    private final RedisTemplate<String, Object> redisTemplate;
    private static final int TTL = 24; // 하루 단위 gpt
    private final RedisTemplate<String, String> stringRedisTemplate;
    private final RedisTemplate<String, RedisSchedule> scheduleRedisTemplate;

    public void saveRefreshToken(long userId, String refreshToken) {
        String key = "refreshToken:" + userId;
        redisTemplate.opsForValue().set(key, refreshToken);
    }

    public Integer getGPTcount(Long userId) {
        String key = "gpt_usage_count: " + userId;
        Integer count = (Integer) redisTemplate.opsForValue().get(key);
        return count;
    }

    public void setGPTIncrement(Long userId) {
        String key = "gpt_usage_count: " + userId;
        // 초기 설정 or 개수 증가
        redisTemplate.opsForValue().increment(key);
        if (getGPTcount(userId) == 1) { // 맨 처음 생성 시 expire 설정
            redisTemplate.expire(key, TTL, TimeUnit.HOURS);
        }
    }

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
        zSet.add(key, start + "-" + end+"-"+groupId, start);
        log.info("타이머 추가: "+key);

    }

    public void deleteTimerByGroupIdAndTime(Long groupId, int start, int end) {
        String key = "timer:"+groupId;
        ZSetOperations<String, String> zSet = stringRedisTemplate.opsForZSet();
        log.info("타이머 제거 "+key+" "+start);

        zSet.remove(key, start +"-"+end+"-"+groupId, String.valueOf(start));
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
        String cacheKey = "schedule:" + LocalDate.now();
        log.info("오늘 스케줄 추가: " + cacheKey);

        RedisSchedule saveSchedule = RedisSchedule.createRedisSchedule(schedule);

        ListOperations<String, RedisSchedule> listOps = scheduleRedisTemplate.opsForList();
        Long ttl = scheduleRedisTemplate.getExpire(cacheKey);

        listOps.rightPush(cacheKey, saveSchedule);

        // 만료 시간 설정
        if (ttl == null || ttl <= 0) {
            LocalDateTime midnight = LocalDate.now().plusDays(1).atStartOfDay();
            ttl = Duration.between(LocalDateTime.now(), midnight).getSeconds();
            scheduleRedisTemplate.expire(cacheKey, ttl, TimeUnit.SECONDS);
        }
    }

    public void addFirstSchedule(List<Schedule> scheduleList) {
        String cacheKey = "schedule:" + LocalDate.now();

        List<RedisSchedule> redisScheduleList = scheduleList.stream()
                .map(RedisSchedule::createRedisSchedule)
                .toList();

        ListOperations<String, RedisSchedule> listOps = scheduleRedisTemplate.opsForList();
        listOps.rightPushAll(cacheKey, redisScheduleList);

        // 자정까지 남은 시간으로 만료 설정
        LocalDateTime midnight = LocalDate.now().plusDays(1).atStartOfDay();
        Long ttl = Duration.between(LocalDateTime.now(), midnight).getSeconds();
        scheduleRedisTemplate.expire(cacheKey, ttl, TimeUnit.SECONDS);

        log.info("첫 스케줄 추가 완료: " + cacheKey);
    }


}