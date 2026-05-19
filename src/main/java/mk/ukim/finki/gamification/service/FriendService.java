package mk.ukim.finki.gamification.service;

import mk.ukim.finki.gamification.dto.GamificationMapper;
import mk.ukim.finki.gamification.dto.request.CreateFriendRequest;
import mk.ukim.finki.gamification.dto.response.FriendshipResponse;
import mk.ukim.finki.gamification.dto.response.UserSummaryResponse;
import mk.ukim.finki.gamification.exception.BadRequestException;
import mk.ukim.finki.gamification.exception.ResourceNotFoundException;
import mk.ukim.finki.gamification.model.entity.Friendship;
import mk.ukim.finki.gamification.model.entity.User;
import mk.ukim.finki.gamification.model.enums.FriendshipStatus;
import mk.ukim.finki.gamification.repository.FriendshipRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class FriendService {

    private final FriendshipRepository friendshipRepository;
    private final UserService userService;

    public FriendService(FriendshipRepository friendshipRepository, UserService userService) {
        this.friendshipRepository = friendshipRepository;
        this.userService = userService;
    }

    @Transactional
    public FriendshipResponse sendRequest(CreateFriendRequest request) {
        if (request.requesterId().equals(request.receiverId())) {
            throw new BadRequestException("A user cannot send a friend request to themselves.");
        }

        User requester = userService.getUserById(request.requesterId());
        User receiver = userService.getUserById(request.receiverId());
        friendshipRepository.findExistingRelationship(
                requester.getId(),
                receiver.getId(),
                Set.of(FriendshipStatus.PENDING, FriendshipStatus.ACCEPTED)
        ).ifPresent(existing -> {
            throw new BadRequestException("There is already a pending or accepted friendship between these users.");
        });

        Friendship friendship = new Friendship(requester, receiver, FriendshipStatus.PENDING);
        return GamificationMapper.toFriendshipResponse(friendshipRepository.save(friendship));
    }

    @Transactional
    public FriendshipResponse acceptRequest(Long requestId) {
        Friendship friendship = getFriendship(requestId);
        ensurePending(friendship);
        friendship.setStatus(FriendshipStatus.ACCEPTED);
        return GamificationMapper.toFriendshipResponse(friendship);
    }

    @Transactional
    public FriendshipResponse rejectRequest(Long requestId) {
        Friendship friendship = getFriendship(requestId);
        ensurePending(friendship);
        friendship.setStatus(FriendshipStatus.REJECTED);
        return GamificationMapper.toFriendshipResponse(friendship);
    }

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> getAcceptedFriends(Long userId) {
        User user = userService.getUserById(userId);
        return friendshipRepository.findByUserIdAndStatus(userId, FriendshipStatus.ACCEPTED).stream()
                .map(friendship -> otherUser(friendship, user.getId()))
                .map(GamificationMapper::toUserSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Long> getAcceptedFriendIds(Long userId) {
        userService.getUserById(userId);
        return friendshipRepository.findByUserIdAndStatus(userId, FriendshipStatus.ACCEPTED).stream()
                .map(friendship -> otherUser(friendship, userId).getId())
                .toList();
    }

    private Friendship getFriendship(Long requestId) {
        return friendshipRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Friend request with id " + requestId + " was not found."));
    }

    private void ensurePending(Friendship friendship) {
        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new BadRequestException("Only pending friend requests can be changed.");
        }
    }

    private User otherUser(Friendship friendship, Long userId) {
        if (friendship.getRequester().getId().equals(userId)) {
            return friendship.getReceiver();
        }
        return friendship.getRequester();
    }
}
