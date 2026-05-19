package mk.ukim.finki.gamification.controller;

import mk.ukim.finki.gamification.dto.response.LeaderboardEntryResponse;
import mk.ukim.finki.gamification.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final UserService userService;

    public LeaderboardController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<LeaderboardEntryResponse> leaderboard() {
        return userService.getLeaderboard();
    }
}
