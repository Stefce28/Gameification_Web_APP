package mk.ukim.finki.gamification.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import mk.ukim.finki.gamification.model.enums.PurchaseStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shop_item_id", nullable = false)
    private ShopItem shopItem;

    @Column(nullable = false)
    private Integer pricePaid;

    @Column(nullable = false, updatable = false)
    private LocalDateTime purchasedAt;

    private LocalDateTime expiresAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PurchaseStatus status = PurchaseStatus.ACTIVE;

    protected Purchase() {
    }

    public Purchase(User user, ShopItem shopItem, Integer pricePaid, LocalDateTime expiresAt) {
        this.user = user;
        this.shopItem = shopItem;
        this.pricePaid = pricePaid;
        this.expiresAt = expiresAt;
    }

    @PrePersist
    void onCreate() {
        if (purchasedAt == null) {
            purchasedAt = LocalDateTime.now();
        }
    }

    public boolean isExpired(LocalDateTime now) {
        return status == PurchaseStatus.ACTIVE && expiresAt != null && expiresAt.isBefore(now);
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public ShopItem getShopItem() {
        return shopItem;
    }

    public Integer getPricePaid() {
        return pricePaid;
    }

    public LocalDateTime getPurchasedAt() {
        return purchasedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public PurchaseStatus getStatus() {
        return status;
    }

    public void setStatus(PurchaseStatus status) {
        this.status = status;
    }
}
