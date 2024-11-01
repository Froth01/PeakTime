package com.dinnertime.peaktime.domain.hiking.service.dto;

import com.dinnertime.peaktime.domain.content.entity.Content;
import com.dinnertime.peaktime.domain.content.repository.ContentRepository;
import com.dinnertime.peaktime.domain.hiking.entity.Hiking;
import com.dinnertime.peaktime.domain.hiking.repository.HikingRepository;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.request.ContentListRequestDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.request.EndHikingRequestDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.request.StartHikingRequestDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.response.HikingCalenderResponseDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.response.StartHikingResponseDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HikingService {
    private final HikingRepository hikingRepository;
    private final UserRepository userRepository;
    private final ContentRepository contentRepository;

    @Transactional
    public StartHikingResponseDto startHiking(/*Long id, */StartHikingRequestDto requestDto) {
        //유저 없으면 에러
        User user = userRepository.findByUserId(1L).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );

        //시작시간에 집중 시간을 더하여 endTime을 구함
        LocalDateTime endTime = requestDto.getStartTime().plusMinutes(requestDto.getAttentionTime());

        Hiking hiking = Hiking.createHiking(user, requestDto, endTime);
        hikingRepository.save(hiking);

        return StartHikingResponseDto.createStartHikingResponseDto(hiking.getHikingId());
    }

    public void endHiking(/*Long id, */EndHikingRequestDto requestDto, Long hikingId) {
        //유저 조회
        User user = userRepository.findByUserId(1L).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );

        //하이킹 조회
        Hiking hiking = hikingRepository.findById(hikingId).orElseThrow(
                () -> new CustomException(ErrorCode.HIKING_NOT_FOUND)
        );

        //본인이 하이킹 하지 않고 실제 종료 시간이 종료 시간보다 작으면 에러
        if(!hiking.getIsSelf() && hiking.getEndTime().isAfter(requestDto.getRealEndTime())) {
            throw new CustomException(ErrorCode.CHILD_ACCOUNT_HIKING_NOT_TERMINABLE);
        }

        //하이킹 실제 종료 시간 업데이트
        hiking.updateRealEndTime(requestDto.getRealEndTime());
        hikingRepository.save(hiking);

        //접속 기록 저장
        List<Content> contentList = requestDto.getContentList()
                .stream()
                .map(contentListRequestDto -> Content.createContent(hiking, contentListRequestDto))
                .toList();
        contentRepository.saveAll(contentList);
    }

    public HikingCalenderResponseDto getCalendar(/*Long userId*/) {
        //유저 조회
        User user = userRepository.findByUserId(1L).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );

        List<HikingCalendarQueryDto> calendarList = hikingRepository.getCalendar();


    }

}
