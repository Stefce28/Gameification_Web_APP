package mk.ukim.finki.gamification.controller;

import jakarta.validation.Valid;
import mk.ukim.finki.gamification.dto.request.CreateFriendRequest;
import mk.ukim.finki.gamification.dto.response.FriendshipResponse;
import mk.ukim.finki.gamification.dto.response.UserSummaryResponse;
import mk.ukim.finki.gamification.service.FriendService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FriendController {

    private final FriendService friendService;

    public FriendController(FriendService friendService) {
        this.friendService = friendService;
    }

    @PostMapping("/friends/request")
    @ResponseStatus(HttpStatus.CREATED)
    public FriendshipResponse request(@Valid @RequestBody CreateFriendRequest request) {
        return friendService.sendRequest(request);
    }

    @PostMapping("/friends/{requestId}/accept")
    public FriendshipResponse accept(@PathVariable Long requestId) {
        return friendService.acceptRequest(requestId);
    }

    @PostMapping("/friends/{requestId}/reject")
    public FriendshipResponse reject(@PathVariable Long requestId) {
        return friendService.rejectRequest(requestId);
    }

    @GetMapping("/users/{id}/friends")
    public List<UserSummaryResponse> friends(@PathVariable Long id) {
        return friendService.getAcceptedFriends(id);
    }
}
