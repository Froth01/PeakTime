package com.dinnertime.peaktime.global.util;

import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${spring.mail.tx}")
    private String tx;

    private final JavaMailSender javaMailSender;

    // 랜덤 인증 코드 보내기
    public void sendCode(String email, String code) {
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(3);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH:mm");
        String formattedExpirationTime = expirationTime.format(formatter);

        String title = "Peaktime 인증 코드 메일입니다!";
        String content = "이메일을 인증하기 위한 절차입니다." +
                        "<br><br>" + "인증 코드는 " + code + "입니다." +
                        "<br><br>" + "인증 코드는 " + formattedExpirationTime + "까지 유효합니다.";

        this.send(email, title, content);
    }

    // 실제로 전송하는 메서드
    private void send(String email, String title, String content) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            helper.setFrom(this.tx);
            helper.setTo(email);
            helper.setSubject(title);
            helper.setText(content, true);
            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.FAILED_SEND_EMAIL);
        }
    }

}
