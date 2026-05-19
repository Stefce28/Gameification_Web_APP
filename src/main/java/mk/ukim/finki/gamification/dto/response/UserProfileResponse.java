package mk.ukim.finki.gamification.dto.response;

import mk.ukim.finki.gamification.model.enums.UserRole;

import java.util.List;

public record UserProfileResponse(
        Long id,
        String username,
        String email,
        UserRole role,
        Integer currentPoints,
        Integer totalEarnedPoints,
        long badgeCount,
        long documentUploadCount,
        long purchaseCount,
        long friendCount,
        List<UserBadgeResponse> badges
) {
}
