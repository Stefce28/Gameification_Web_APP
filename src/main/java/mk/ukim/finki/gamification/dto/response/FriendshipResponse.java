package mk.ukim.finki.gamification.dto.response;

import mk.ukim.finki.gamification.model.enums.FriendshipStatus;

import java.time.LocalDateTime;

public record FriendshipResponse(
        Long id,
        UserSummaryResponse requester,
        UserSummaryResponse receiver,
        FriendshipStatus status,
        LocalDateTime createdAt
) {
}
