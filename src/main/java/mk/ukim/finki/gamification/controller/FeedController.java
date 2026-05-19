package mk.ukim.finki.gamification.controller;

import mk.ukim.finki.gamification.dto.response.ActivityFeedItemResponse;
import mk.ukim.finki.gamification.service.FeedService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping
    public List<ActivityFeedItemResponse> globalFeed(@RequestParam(defaultValue = "20") int limit) {
        return feedService.getGlobalFeed(limit);
    }

    @GetMapping("/friends/{userId}")
    public List<ActivityFeedItemResponse> friendsFeed(@PathVariable Long userId,
                                                      @RequestParam(defaultValue = "20") int limit) {
        return feedService.getFriendsFeed(userId, limit);
    }
}
