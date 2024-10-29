package com.dinnertime.peaktime.global.exception;

import org.springframework.http.HttpStatus;

//에러 코드 모음집
//사용법 에러명("message", 실제 에러상태)
public enum ErrorCode {

    INVALID_PRESET_TITLE_LENGTH("프리셋 타이틀이 6자를 초과하거나 2자 미만일 수 없습니다.",HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND("존재하지 않은 유저입니다.", HttpStatus.NOT_FOUND),
    GROUP_NOT_FOUND("존재하지 않는 그룹입니다.", HttpStatus.NOT_FOUND),
    ;

    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
