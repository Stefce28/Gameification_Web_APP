package mk.ukim.finki.gamification.dto;

import mk.ukim.finki.gamification.dto.response.ActivityFeedItemResponse;
import mk.ukim.finki.gamification.dto.response.BadgeResponse;
import mk.ukim.finki.gamification.dto.response.DocumentEventResponse;
import mk.ukim.finki.gamification.dto.response.FriendshipResponse;
import mk.ukim.finki.gamification.dto.response.PointTransactionResponse;
import mk.ukim.finki.gamification.dto.response.PurchaseResponse;
import mk.ukim.finki.gamification.dto.response.ShopItemResponse;
import mk.ukim.finki.gamification.dto.response.UserBadgeResponse;
import mk.ukim.finki.gamification.dto.response.UserSummaryResponse;
import mk.ukim.finki.gamification.model.entity.Badge;
import mk.ukim.finki.gamification.model.entity.DocumentEvent;
import mk.ukim.finki.gamification.model.entity.Friendship;
import mk.ukim.finki.gamification.model.entity.PointTransaction;
import mk.ukim.finki.gamification.model.entity.Purchase;
import mk.ukim.finki.gamification.model.entity.ShopItem;
import mk.ukim.finki.gamification.model.entity.User;
import mk.ukim.finki.gamification.model.entity.UserBadge;

public final class GamificationMapper {

    private GamificationMapper() {
    }

    public static UserSummaryResponse toUserSummary(User user) {
        return new UserSummaryResponse(user.getId(), user.getUsername(), user.getEmail());
    }

    public static DocumentEventResponse toDocumentEventResponse(DocumentEvent event) {
        return new DocumentEventResponse(
                event.getId(),
                event.getUser().getId(),
                event.getUser().getUsername(),
                event.getTitle(),
                event.getDocumentType(),
                event.getFileSizeKb(),
                event.getScientificField(),
                event.getPointsAwarded(),
                event.getCreatedAt()
        );
    }

    public static ActivityFeedItemResponse toActivityFeedItemResponse(DocumentEvent event) {
        return new ActivityFeedItemResponse(
                event.getId(),
                toUserSummary(event.getUser()),
                event.getTitle(),
                event.getDocumentType(),
                event.getScientificField(),
                event.getPointsAwarded(),
                event.getCreatedAt()
        );
    }

    public static PointTransactionResponse toPointTransactionResponse(PointTransaction transaction) {
        return new PointTransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getReason(),
                transaction.getCreatedAt()
        );
    }

    public static BadgeResponse toBadgeResponse(Badge badge) {
        return new BadgeResponse(
                badge.getId(),
                badge.getName(),
                badge.getDescription(),
                badge.getPointsRequired(),
                badge.getIconUrl()
        );
    }

    public static UserBadgeResponse toUserBadgeResponse(UserBadge userBadge) {
        return new UserBadgeResponse(
                userBadge.getId(),
                toBadgeResponse(userBadge.getBadge()),
                userBadge.getEarnedAt()
        );
    }

    public static ShopItemResponse toShopItemResponse(ShopItem item) {
        return new ShopItemResponse(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPricePoints(),
                item.getQuantity(),
                item.getItemType(),
                item.getExpirationDays(),
                item.getActive()
        );
    }

    public static PurchaseResponse toPurchaseResponse(Purchase purchase) {
        return new PurchaseResponse(
                purchase.getId(),
                purchase.getUser().getId(),
                purchase.getUser().getUsername(),
                toShopItemResponse(purchase.getShopItem()),
                purchase.getPricePaid(),
                purchase.getPurchasedAt(),
                purchase.getExpiresAt(),
                purchase.getStatus()
        );
    }

    public static FriendshipResponse toFriendshipResponse(Friendship friendship) {
        return new FriendshipResponse(
                friendship.getId(),
                toUserSummary(friendship.getRequester()),
                toUserSummary(friendship.getReceiver()),
                friendship.getStatus(),
                friendship.getCreatedAt()
        );
    }
}
