package mk.ukim.finki.gamification.dto.response;

import mk.ukim.finki.gamification.model.enums.PurchaseStatus;

import java.time.LocalDateTime;

public record PurchaseResponse(
        Long id,
        Long userId,
        String username,
        ShopItemResponse shopItem,
        Integer pricePaid,
        LocalDateTime purchasedAt,
        LocalDateTime expiresAt,
        PurchaseStatus status
) {
}
