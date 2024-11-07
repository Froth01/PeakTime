package com.dinnertime.peaktime.domain.schedule.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.preset.repository.PresetRepository;
import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import com.dinnertime.peaktime.domain.schedule.repository.EmitterRepository;
import com.dinnertime.peaktime.domain.schedule.repository.ScheduleRepository;
import com.dinnertime.peaktime.domain.schedule.service.dto.response.SendTimerResponseDto;
import com.dinnertime.peaktime.domain.timer.entity.Timer;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final GroupRepository groupRepository;
    private final UserGroupRepository userGroupRepository;
    private final EmitterRepository emitterRepository;
    private final PresetRepository presetRepository;

    //연결 지속시간 한시간
    private static final long DEFAULT_TIMEOUT = 60L * 1000 * 60;

    public SseEmitter subScribe(Long userId, String lastEventId) {
        //그룹 가져오기
        UserGroup userGroup = userGroupRepository.findByUser_UserId(userId).orElseThrow(
                () -> new CustomException(ErrorCode.GROUP_NOT_FOUND)
        );

        Long groupId = userGroup.getGroup().getGroupId();

        //고유한 아이디 생성
        //뒤에 시간이 있는 이유는 연결끊겼을때 전송해야하는 메시지를 보내기 위해 사용
        String emitterId = groupId+"_"+userId+"_"+System.currentTimeMillis();

        //저장
        SseEmitter emitter = emitterRepository.save(emitterId, new SseEmitter(DEFAULT_TIMEOUT));

        //시간 초과나 비동기 요청 안되면 삭제
        emitter.onCompletion(()->emitterRepository.deleteById(emitterId));
        emitter.onTimeout(() -> emitterRepository.deleteById(emitterId));

        //최초 연결시 메시지를 안보낼 경우 503에러 발생 하므로 데미 데이터 전송
        sendToClient(emitter, emitterId, "EventStream. ["+groupId+"-"+userId+"]");
        
        //lastEventId 이게 있으면 연결이 종료 되었다는 뜻 연결 지속시간
        //남아 있는 모든 데이터를 전송
        if(!lastEventId.isEmpty()) {
            Map<String, Object> events = emitterRepository.findEmitterCacheByGroupId(groupId);
            events.entrySet().stream()
                    //저장된 key값 비교를 통해 유실된 데이터만 재전송 할 수 있음
                    .filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
                    .forEach(entry -> sendToClient(emitter, entry.getKey(), entry.getValue()));
        }

        return emitter;
    }

    public void sendToClient(SseEmitter emitter, String emitterId, Object data) {
        try {
            //데이터를 보냄
            emitter.send(SseEmitter.event()
                    .id(emitterId)
                    .data(data));
        } catch (IOException e) {
            emitterRepository.deleteById(emitterId);
            throw new CustomException(ErrorCode.FAIL_SEND_SSE_MESSAGE);
        }
    }

    public void send(Long groupId, int attentionTime) {
        Map<String, SseEmitter> sseEmitterList = emitterRepository.findEmitterByGroupId(groupId);

        Group group = groupRepository.findByGroupIdAndIsDeleteFalse(groupId).orElseThrow(
                () -> new CustomException(ErrorCode.GROUP_NOT_FOUND)
        );

        Preset preset = group.getPreset();


        sseEmitterList.forEach(
                (key, emitter) -> {
                    //
                    SendTimerResponseDto responseDto = SendTimerResponseDto.createSendTimerResponseDto(attentionTime, preset);
                    emitterRepository.saveEventCache(key, responseDto);

                    sendToClient(emitter, key, responseDto);
                }
        );
    }

    @Transactional
    public List<Schedule> createSchedule(TimerCreateRequestDto requestDto) {
        int repeatDay = requestDto.getRepeatDay();
        int attentionTime = requestDto.getAttentionTime();
        LocalTime startTime = requestDto.getStartTime().toLocalTime();

        Group group = groupRepository.findByGroupIdAndIsDeleteFalse(requestDto.getGroupId()).orElseThrow(
                () -> new CustomException(ErrorCode.GROUP_NOT_FOUND)
        );

        List<Schedule> scheduleList = new ArrayList<>();

        //6이 월요일 0이 일요일
        for(int day=0; day<6;day++) {
            if((repeatDay & (1 << day)) != 0) {
                Schedule schedule = Schedule.createSchedule(day, startTime, attentionTime, group);
                scheduleList.add(schedule);
            }
        }
        //스케쥴링 모두 저장
        scheduleRepository.saveAll(scheduleList);

        return scheduleList;
    }

    @Transactional(readOnly = true)
    public List<Schedule> getNowDaySchedule() {
        int dayOfWeek = 7 - LocalDate.now().getDayOfWeek().getValue();
        return scheduleRepository.findAllByDayOfWeek(dayOfWeek);
    }

    @Transactional
    public void deleteSchedule(Timer timer) {
        int repeatDay = timer.getRepeatDay();
        LocalTime startTime = timer.getStartTime().toLocalTime();

        List<Integer> dayOfWeekList = new ArrayList<>();

        for(int day=0; day<6;day++) {
            if((repeatDay & (1 << day)) != 0) {
                dayOfWeekList.add(day);
            }
        }

        scheduleRepository.deleteAllByGroup_groupIdAndDayOfWeekIsInAndStartTime(timer.getGroup().getGroupId(), dayOfWeekList, startTime);
    }

}
