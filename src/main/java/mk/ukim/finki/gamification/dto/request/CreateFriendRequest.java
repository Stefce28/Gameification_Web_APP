package mk.ukim.finki.gamification.dto.request;

import jakarta.validation.constraints.NotNull;

public record CreateFriendRequest(
        @NotNull Long requesterId,
        @NotNull Long receiverId
) {
}
