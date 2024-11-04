package com.dinnertime.peaktime.domain.child.service;

import com.dinnertime.peaktime.domain.child.service.dto.request.CreateChildRequestDto;
import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChildService {

    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final GroupRepository groupRepository;

    @Transactional
    public void createChild(Long userId, CreateChildRequestDto requestDto){

        // 1. 해당 그룹의 인원이 30명 미만인지 확인
        Group group = groupRepository.findByGroupIdAndIsDeleteFalse(requestDto.getGroupId())
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        Long userCount = userGroupRepository.countAllByGroup(group);
        if(userCount >= 30) {
            throw new CustomException(ErrorCode.FAILED_CREATE_CHILD_USER);
        }

        // 2. 아이디 형식 확인
        // 3. 닉네임 형식 확인
        // 4. 비밀번호 형식 확인
        // 5. 아이디 중복 확인
        // 6. 비밀번호, 비밀번호 확인 일치 확인
    }

    @Transactional
    public void deleteChild(Long userId, Long childId){
        // 1. 자식 계정 확인
        User childUser = userRepository.findByUserIdAndIsDeleteFalse(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 1. user_group 테이블 삭제
        UserGroup userGroup = userGroupRepository.findByUser_UserId(childId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        userGroupRepository.delete(userGroup);

        // 2. user 테이블 수정 및 저장
        childUser.deleteUser();
        userRepository.save(childUser);
    }
}
