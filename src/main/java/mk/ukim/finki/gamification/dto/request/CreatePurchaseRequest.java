package mk.ukim.finki.gamification.dto.request;

import jakarta.validation.constraints.NotNull;

public record CreatePurchaseRequest(
        @NotNull Long userId,
        @NotNull Long shopItemId
) {
}
