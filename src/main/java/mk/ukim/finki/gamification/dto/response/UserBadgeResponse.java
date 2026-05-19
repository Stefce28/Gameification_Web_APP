package mk.ukim.finki.gamification.dto.response;

import java.time.LocalDateTime;

public record UserBadgeResponse(
        Long id,
        BadgeResponse badge,
        LocalDateTime earnedAt
) {
}
