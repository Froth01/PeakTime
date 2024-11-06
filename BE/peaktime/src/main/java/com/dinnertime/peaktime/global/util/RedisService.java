package com.dinnertime.peaktime.global.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final int TTL = 24; // 하루 단위 gpt

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


}