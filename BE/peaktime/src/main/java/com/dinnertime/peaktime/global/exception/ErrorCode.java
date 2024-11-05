package com.dinnertime.peaktime.global.exception;

import org.springframework.http.HttpStatus;

//에러 코드 모음집
//사용법 에러명("message", 실제 에러상태)
public enum ErrorCode {

    INVALID_PRESET_TITLE_LENGTH("프리셋 타이틀이 6자를 초과하거나 2자 미만일 수 없습니다.",HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND("존재하지 않은 유저입니다.", HttpStatus.NOT_FOUND),
    GROUP_NOT_FOUND("존재하지 않는 그룹입니다.", HttpStatus.BAD_REQUEST),
    GROUP_NAME_ALREADY_EXISTS("중복된 그룹 이름입니다.", HttpStatus.UNPROCESSABLE_ENTITY),
    FAILED_CREATE_GROUP("최대 5개의 그룹만 생성할 수 있습니다.", HttpStatus.UNPROCESSABLE_ENTITY),
    PRESET_NOT_FOUND("존재하지 않는 프리셋에 대한 작업입니다.", HttpStatus.NOT_FOUND),
    FAILED_DELETE_PRESET_IN_GROUP("그룹에서 사용하는 프리셋은 삭제할 수 없습니다.", HttpStatus.BAD_REQUEST),
    SUMMARY_NOT_FOUND("해당 요약 내용을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    MEMO_NOT_FOUND("해당 메모 내용을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    HIKING_NOT_FOUND("존재하지 않는 하이킹입니다.", HttpStatus.NOT_FOUND),
    CHILD_ACCOUNT_HIKING_NOT_TERMINABLE("자식 계정은 하이킹 중 종료 할 수 없습니다.", HttpStatus.FORBIDDEN),
    MAX_GPT_REQUEST_TODAY("하루에 GPT 요약 요청은 최대 3번까지 가능합니다.", HttpStatus.BAD_REQUEST),
    GPT_BAD_REQUEST("GPT 요청을 처리하다가 실패했습니다.", HttpStatus.BAD_REQUEST),
    FAILED_PROMPT_TO_JSON("요약을 위한 본문 처리에 실패했습니다. 잠시 후 다시 시도해주세요.", HttpStatus.BAD_REQUEST),
    INVALID_USER_LOGIN_ID_FORMAT("유저 로그인 아이디 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD_FORMAT("비밀번호 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    INVALID_NICKNAME_FORMAT("닉네임 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL_FORMAT("이메일 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    DUPLICATED_USER_LOGIN_ID("이미 존재하는 아이디입니다.", HttpStatus.CONFLICT),
    DUPLICATED_EMAIL("이미 존재하는 이메일입니다.", HttpStatus.CONFLICT),
    NOT_EQUAL_PASSWORD("비밀번호와 비밀번호 확인이 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    FILE_NOT_FOUND("Default Block Website File을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    FAILED_CREATE_CHILD_USER("그룹에는 최대 30명의 자식 계정만 존재할 수 있습니다.", HttpStatus.UNPROCESSABLE_ENTITY),
    TIMER_NOT_FOUND("존재하지 않는 타이머입니다.", HttpStatus.NOT_FOUND),
    TIME_SLOT_OVERLAP("선택한 시간 범위가 다른 예약과 겹칩니다.", HttpStatus.CONFLICT),
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
