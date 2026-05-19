package mk.ukim.finki.gamification.dto.response;

import mk.ukim.finki.gamification.model.enums.ShopItemType;

public record ShopItemResponse(
        Long id,
        String name,
        String description,
        Integer pricePoints,
        Integer quantity,
        ShopItemType itemType,
        Integer expirationDays,
        Boolean active
) {
}
