package mk.ukim.finki.gamification.controller;

import jakarta.validation.Valid;
import mk.ukim.finki.gamification.dto.request.CreatePurchaseRequest;
import mk.ukim.finki.gamification.dto.request.CreateShopItemRequest;
import mk.ukim.finki.gamification.dto.request.UpdateShopItemRequest;
import mk.ukim.finki.gamification.dto.response.PurchaseResponse;
import mk.ukim.finki.gamification.dto.response.ShopItemResponse;
import mk.ukim.finki.gamification.service.ShopService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    private static final String ACTING_USER_HEADER = "X-User-Id";

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping("/items")
    public List<ShopItemResponse> activeItems() {
        return shopService.getActiveItems();
    }

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ShopItemResponse createItem(@RequestHeader(ACTING_USER_HEADER) Long adminUserId,
                                       @Valid @RequestBody CreateShopItemRequest request) {
        return shopService.createItem(adminUserId, request);
    }

    @PutMapping("/items/{id}")
    public ShopItemResponse updateItem(@RequestHeader(ACTING_USER_HEADER) Long adminUserId,
                                       @PathVariable Long id,
                                       @Valid @RequestBody UpdateShopItemRequest request) {
        return shopService.updateItem(adminUserId, id, request);
    }

    @DeleteMapping("/items/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivateItem(@RequestHeader(ACTING_USER_HEADER) Long adminUserId, @PathVariable Long id) {
        shopService.deactivateItem(adminUserId, id);
    }

    @PostMapping("/purchase")
    @ResponseStatus(HttpStatus.CREATED)
    public PurchaseResponse purchase(@Valid @RequestBody CreatePurchaseRequest request) {
        return shopService.purchaseItem(request);
    }
}
