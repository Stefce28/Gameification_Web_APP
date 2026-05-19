package mk.ukim.finki.gamification.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import mk.ukim.finki.gamification.model.enums.ShopItemType;

@Entity
@Table(name = "shop_items")
public class ShopItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private Integer pricePoints;

    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ShopItemType itemType;

    private Integer expirationDays;

    @Column(nullable = false)
    private Boolean active = true;

    protected ShopItem() {
    }

    public ShopItem(String name, String description, Integer pricePoints, Integer quantity,
                    ShopItemType itemType, Integer expirationDays, Boolean active) {
        this.name = name;
        this.description = description;
        this.pricePoints = pricePoints;
        this.quantity = quantity;
        this.itemType = itemType;
        this.expirationDays = expirationDays;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPricePoints() {
        return pricePoints;
    }

    public void setPricePoints(Integer pricePoints) {
        this.pricePoints = pricePoints;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public ShopItemType getItemType() {
        return itemType;
    }

    public void setItemType(ShopItemType itemType) {
        this.itemType = itemType;
    }

    public Integer getExpirationDays() {
        return expirationDays;
    }

    public void setExpirationDays(Integer expirationDays) {
        this.expirationDays = expirationDays;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
