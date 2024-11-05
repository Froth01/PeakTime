package com.dinnertime.peaktime.global.auth.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtService implements InitializingBean {

    // JWT 만료 시간
    @Value("${jwt.token.access-expire-time}")
    private int ACCESSTOKEN_EXPIRE_TIME;
    @Value("${jwt.token.refresh-expire-time}")
    private int REFRESHTOKEN_EXPIRE_TIME;

    // JWT Signature 생성에 사용되는 문자열(서버만 알고 있는 비밀번호) -> a
    @Value("${jwt.token.secret-key}")
    private String SECRET_KEY;

    // JWT 서명에 사용되는 SecretKey 객체 -> b
    private SecretKey secretKey;

    @Override
    public void afterPropertiesSet() {
        this.secretKey = buildKey();
    }

    // a를 b로 변환하는 메서드
    private SecretKey buildKey() {
        byte[] decodedKeyValue = Base64.getDecoder().decode(SECRET_KEY); // Decoder 사용
        return Keys.hmacShaKeyFor(decodedKeyValue);
    }

    // Access Token 생성
    public String createAccessToken(long userId, String authority) {
        Instant now = Instant.now();
        return Jwts.builder()
                .claim("userId", userId)
                .claim("authority", authority)
                .signWith(secretKey)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(ACCESSTOKEN_EXPIRE_TIME)))
                .compact();
    }

    // Refresh Token 생성
    public String createRefreshToken(long userId, String authority) {
        Instant now = Instant.now();
        return Jwts.builder()
                .claim("userId", userId)
                .claim("authority", authority)
                .signWith(secretKey)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(REFRESHTOKEN_EXPIRE_TIME)))
                .compact();
    }

    // Cookie에 Refresh Token 담기
    public void addRefreshTokenToCookie(HttpServletResponse httpServletResponse, String refreshToken) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        // 어느 페이지에서도 유효
        cookie.setPath("/");
        cookie.setMaxAge(REFRESHTOKEN_EXPIRE_TIME);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        httpServletResponse.addCookie(cookie);
    }

}
