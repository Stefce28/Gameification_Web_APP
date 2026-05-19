package mk.ukim.finki.gamification.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import mk.ukim.finki.gamification.model.enums.ShopItemType;

public record UpdateShopItemRequest(
        @NotBlank @Size(max = 160) String name,
        @NotBlank @Size(max = 500) String description,
        @NotNull @Positive Integer pricePoints,
        @NotNull @PositiveOrZero Integer quantity,
        @NotNull ShopItemType itemType,
        @PositiveOrZero Integer expirationDays,
        @NotNull Boolean active
) {
}
