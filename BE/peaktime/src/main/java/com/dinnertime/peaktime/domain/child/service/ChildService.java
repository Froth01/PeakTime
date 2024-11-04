package com.dinnertime.peaktime.domain.child.service;

import com.dinnertime.peaktime.domain.child.service.dto.request.CreateChildRequestDto;
import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.user.service.UserService;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import com.dinnertime.peaktime.global.auth.service.AuthService;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChildService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final GroupRepository groupRepository;

    @Transactional
    public void createChild(CreateChildRequestDto requestDto){

        // 1. 해당 그룹의 인원이 30명 미만인지 확인
        Group group = groupRepository.findByGroupIdAndIsDeleteFalse(requestDto.getGroupId())
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        Long userCount = userGroupRepository.countAllByGroup(group);
        if(userCount >= 30) {
            throw new CustomException(ErrorCode.FAILED_CREATE_CHILD_USER);
        }

        // 2. 아이디 형식 확인
        if(!AuthUtil.checkFormatValidationUserLoginId(requestDto.getChildLoginId())){
            throw new CustomException(ErrorCode.INVALID_USER_LOGIN_ID_FORMAT);
        }

        // 3. 아이디 중복 확인
        if(this.checkDuplicateUserLoginId(requestDto.getChildLoginId())){
            throw new CustomException(ErrorCode.DUPLICATED_USER_LOGIN_ID);
        };

        // 4. 비밀번호 형식 확인
        if(!AuthUtil.checkFormatValidationPassword(requestDto.getChildPassword())){
           throw new CustomException(ErrorCode.INVALID_PASSWORD_FORMAT);
        }

        // 5. 비밀번호, 비밀번호 확인 일치 확인
        if(!requestDto.getChildPassword().equals(requestDto.getChildConfirmPassword())){
            throw new CustomException(ErrorCode.NOT_EQUAL_PASSWORD);
        }

        // 6. 닉네임 형식 확인
        if(!AuthUtil.checkFormatValidationNickname(requestDto.getChildNickname())){
            throw new CustomException(ErrorCode.INVALID_NICKNAME_FORMAT);
        }

        // 7. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(requestDto.getChildPassword());

        // 8. 유저 테이블 저장
        User user = User.createChildUser(requestDto.getChildLoginId(), encodedPassword, requestDto.getChildNickname());
        userRepository.save(user);

        // 9. 유저 그룹 테이블 저장
        UserGroup userGroup = UserGroup.createUserGroup(user, group);
        userGroupRepository.save(userGroup);
    }

    @Transactional
    public void deleteChild(Long childId){
        // 1. 자식 계정 확인
        User childUser = userRepository.findByUserIdAndIsDeleteFalseAndIsRootFalse(childId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 2. user_group 테이블 삭제
        UserGroup userGroup = userGroupRepository.findByUser_UserId(childId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        userGroupRepository.delete(userGroup);

        // 3. user 테이블 수정 및 저장
        childUser.deleteUser();
        userRepository.save(childUser);
    }

    // 아이디 중복 검사 (유저 로그인 아이디로 검사. 이미 존재하면 true 반환)
    private boolean checkDuplicateUserLoginId(String userLoginId) {
        return userRepository.findByUserLoginId(userLoginId).isPresent();
    }
}