package mk.ukim.finki.gamification.controller;

import mk.ukim.finki.gamification.dto.response.DocumentEventResponse;
import mk.ukim.finki.gamification.dto.response.PointTransactionResponse;
import mk.ukim.finki.gamification.dto.response.PurchaseResponse;
import mk.ukim.finki.gamification.dto.response.UserBadgeResponse;
import mk.ukim.finki.gamification.dto.response.UserProfileResponse;
import mk.ukim.finki.gamification.service.DocumentEventService;
import mk.ukim.finki.gamification.service.ShopService;
import mk.ukim.finki.gamification.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ShopService shopService;
    private final DocumentEventService documentEventService;

    public UserController(UserService userService,
                          ShopService shopService,
                          DocumentEventService documentEventService) {
        this.userService = userService;
        this.shopService = shopService;
        this.documentEventService = documentEventService;
    }

    @GetMapping("/{id}/profile")
    public UserProfileResponse profile(@PathVariable Long id) {
        return userService.getProfile(id);
    }

    @GetMapping("/{id}/points/history")
    public List<PointTransactionResponse> pointsHistory(@PathVariable Long id) {
        return userService.getPointHistory(id);
    }

    @GetMapping("/{id}/badges")
    public List<UserBadgeResponse> badges(@PathVariable Long id) {
        return userService.getBadges(id);
    }

    @GetMapping("/{id}/purchases")
    public List<PurchaseResponse> purchases(@PathVariable Long id) {
        return shopService.getPurchasesForUser(id);
    }

    @GetMapping("/{id}/document-events")
    public List<DocumentEventResponse> documentEvents(@PathVariable Long id) {
        return documentEventService.getDocumentEventsForUser(id);
    }
}
