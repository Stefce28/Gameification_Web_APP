package mk.ukim.finki.gamification.dto.response;

import mk.ukim.finki.gamification.model.enums.TransactionType;

import java.time.LocalDateTime;

public record PointTransactionResponse(
        Long id,
        Integer amount,
        TransactionType type,
        String reason,
        LocalDateTime createdAt
) {
}
