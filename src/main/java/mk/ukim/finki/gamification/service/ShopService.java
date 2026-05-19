package mk.ukim.finki.gamification.service;

import mk.ukim.finki.gamification.dto.GamificationMapper;
import mk.ukim.finki.gamification.dto.request.CreatePurchaseRequest;
import mk.ukim.finki.gamification.dto.request.CreateShopItemRequest;
import mk.ukim.finki.gamification.dto.request.UpdateShopItemRequest;
import mk.ukim.finki.gamification.dto.response.PurchaseResponse;
import mk.ukim.finki.gamification.dto.response.ShopItemResponse;
import mk.ukim.finki.gamification.exception.BadRequestException;
import mk.ukim.finki.gamification.exception.ResourceNotFoundException;
import mk.ukim.finki.gamification.model.entity.PointTransaction;
import mk.ukim.finki.gamification.model.entity.Purchase;
import mk.ukim.finki.gamification.model.entity.ShopItem;
import mk.ukim.finki.gamification.model.entity.User;
import mk.ukim.finki.gamification.model.enums.PurchaseStatus;
import mk.ukim.finki.gamification.model.enums.TransactionType;
import mk.ukim.finki.gamification.repository.PointTransactionRepository;
import mk.ukim.finki.gamification.repository.PurchaseRepository;
import mk.ukim.finki.gamification.repository.ShopItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShopService {

    private final ShopItemRepository shopItemRepository;
    private final PurchaseRepository purchaseRepository;
    private final PointTransactionRepository pointTransactionRepository;
    private final UserService userService;

    public ShopService(ShopItemRepository shopItemRepository,
                       PurchaseRepository purchaseRepository,
                       PointTransactionRepository pointTransactionRepository,
                       UserService userService) {
        this.shopItemRepository = shopItemRepository;
        this.purchaseRepository = purchaseRepository;
        this.pointTransactionRepository = pointTransactionRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<ShopItemResponse> getActiveItems() {
        return shopItemRepository.findByActiveTrueOrderByNameAsc().stream()
                .map(GamificationMapper::toShopItemResponse)
                .toList();
    }

    @Transactional
    public ShopItemResponse createItem(Long adminUserId, CreateShopItemRequest request) {
        userService.ensureAdmin(adminUserId);
        ShopItem item = new ShopItem(
                request.name().trim(),
                request.description().trim(),
                request.pricePoints(),
                request.quantity(),
                request.itemType(),
                request.expirationDays(),
                request.active() == null || request.active()
        );
        return GamificationMapper.toShopItemResponse(shopItemRepository.save(item));
    }

    @Transactional
    public ShopItemResponse updateItem(Long adminUserId, Long itemId, UpdateShopItemRequest request) {
        userService.ensureAdmin(adminUserId);
        ShopItem item = getShopItem(itemId);
        item.setName(request.name().trim());
        item.setDescription(request.description().trim());
        item.setPricePoints(request.pricePoints());
        item.setQuantity(request.quantity());
        item.setItemType(request.itemType());
        item.setExpirationDays(request.expirationDays());
        item.setActive(request.active());
        return GamificationMapper.toShopItemResponse(item);
    }

    @Transactional
    public void deactivateItem(Long adminUserId, Long itemId) {
        userService.ensureAdmin(adminUserId);
        ShopItem item = getShopItem(itemId);
        item.setActive(false);
    }

    @Transactional
    public PurchaseResponse purchaseItem(CreatePurchaseRequest request) {
        User user = userService.getUserById(request.userId());
        ShopItem item = getShopItem(request.shopItemId());

        if (!item.getActive()) {
            throw new BadRequestException("This shop item is not active.");
        }
        if (item.getQuantity() <= 0) {
            throw new BadRequestException("This shop item is out of stock.");
        }
        if (user.getCurrentPoints() < item.getPricePoints()) {
            throw new BadRequestException("User does not have enough current points for this purchase.");
        }

        user.spendPoints(item.getPricePoints());
        item.setQuantity(item.getQuantity() - 1);

        LocalDateTime expiresAt = calculateExpiration(item);
        Purchase purchase = purchaseRepository.save(new Purchase(user, item, item.getPricePoints(), expiresAt));
        pointTransactionRepository.save(new PointTransaction(
                user,
                -item.getPricePoints(),
                TransactionType.SPENT,
                "Shop purchase: " + item.getName()
        ));

        return GamificationMapper.toPurchaseResponse(purchase);
    }

    @Transactional
    public List<PurchaseResponse> getPurchasesForUser(Long userId) {
        userService.getUserById(userId);
        LocalDateTime now = LocalDateTime.now();
        return purchaseRepository.findByUserIdOrderByPurchasedAtDesc(userId).stream()
                .peek(purchase -> {
                    if (purchase.isExpired(now)) {
                        purchase.setStatus(PurchaseStatus.EXPIRED);
                    }
                })
                .map(GamificationMapper::toPurchaseResponse)
                .toList();
    }

    private ShopItem getShopItem(Long itemId) {
        return shopItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop item with id " + itemId + " was not found."));
    }

    private LocalDateTime calculateExpiration(ShopItem item) {
        if (item.getExpirationDays() == null || item.getExpirationDays() <= 0) {
            return null;
        }
        return LocalDateTime.now().plusDays(item.getExpirationDays());
    }
}
