package mk.ukim.finki.gamification.controller;

import jakarta.validation.Valid;
import mk.ukim.finki.gamification.dto.request.CreateBadgeRequest;
import mk.ukim.finki.gamification.dto.response.BadgeResponse;
import mk.ukim.finki.gamification.service.BadgeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
public class BadgeController {

    private static final String ACTING_USER_HEADER = "X-User-Id";

    private final BadgeService badgeService;

    public BadgeController(BadgeService badgeService) {
        this.badgeService = badgeService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BadgeResponse create(@RequestHeader(ACTING_USER_HEADER) Long adminUserId,
                                @Valid @RequestBody CreateBadgeRequest request) {
        return badgeService.createBadge(adminUserId, request);
    }

    @GetMapping
    public List<BadgeResponse> all() {
        return badgeService.getAllBadges();
    }
}
