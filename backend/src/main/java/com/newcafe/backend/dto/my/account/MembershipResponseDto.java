package com.newcafe.backend.dto.my.account;

public record MembershipResponseDto(int level, String name, long orderCount, Integer nextLevelAt) {}
