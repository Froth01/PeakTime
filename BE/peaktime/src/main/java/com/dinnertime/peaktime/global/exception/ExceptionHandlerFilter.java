package com.dinnertime.peaktime.global.exception;

import com.dinnertime.peaktime.global.util.ResultDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
public class ExceptionHandlerFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (CustomException e) {
            setErrorResponse(e.getErrorCode().getHttpStatus(), response, e);
        } catch (Exception e) {
            setErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, response, e);
        }
    }

    private void setErrorResponse(HttpStatus status, HttpServletResponse response, Throwable ex) throws IOException {

        // response error 헤더 통일 시켜주기
        response.setStatus(status.value());
        response.setContentType("application/json; charset=utf-8");

        ResultDto<Object> errorResponse = ResultDto.res(status.value(), ex.getMessage());

        response.getWriter().write(new ObjectMapper().writeValueAsString(errorResponse));
    }



}