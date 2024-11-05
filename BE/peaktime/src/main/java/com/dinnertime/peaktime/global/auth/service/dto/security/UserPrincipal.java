package com.dinnertime.peaktime.global.auth.service.dto.security;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserPrincipal implements UserDetails {

    private long userId;
    private String password;
    private String authority; // "root" or "child"
    private Boolean isDelete;

    @Builder
    private UserPrincipal(long userId, String password, String authority, Boolean isDelete) {
        this.userId = userId;
        this.password = password;
        this.authority = authority;
        this.isDelete = isDelete;
    }

    public static UserPrincipal createUserPrincipal(long userId, String password, String authority, Boolean isDelete) {
        return UserPrincipal.builder()
                .userId(userId)
                .password(password)
                .authority(authority)
                .isDelete(isDelete)
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return "";
    }
}
