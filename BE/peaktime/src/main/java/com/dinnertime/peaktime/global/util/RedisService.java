package com.dinnertime.peaktime.global.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void saveRefreshToken(long userId, String refreshToken) {
        String key = "refreshToken:" + userId;
        redisTemplate.opsForValue().set(key, refreshToken);
    }

}
