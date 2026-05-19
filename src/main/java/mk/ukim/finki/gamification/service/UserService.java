package mk.ukim.finki.gamification.service;

import mk.ukim.finki.gamification.dto.GamificationMapper;
import mk.ukim.finki.gamification.dto.response.LeaderboardEntryResponse;
import mk.ukim.finki.gamification.dto.response.PointTransactionResponse;
import mk.ukim.finki.gamification.dto.response.UserBadgeResponse;
import mk.ukim.finki.gamification.dto.response.UserProfileResponse;
import mk.ukim.finki.gamification.exception.ForbiddenException;
import mk.ukim.finki.gamification.exception.ResourceNotFoundException;
import mk.ukim.finki.gamification.model.entity.User;
import mk.ukim.finki.gamification.model.enums.FriendshipStatus;
import mk.ukim.finki.gamification.model.enums.UserRole;
import mk.ukim.finki.gamification.repository.DocumentEventRepository;
import mk.ukim.finki.gamification.repository.FriendshipRepository;
import mk.ukim.finki.gamification.repository.PointTransactionRepository;
import mk.ukim.finki.gamification.repository.PurchaseRepository;
import mk.ukim.finki.gamification.repository.UserBadgeRepository;
import mk.ukim.finki.gamification.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PointTransactionRepository pointTransactionRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final PurchaseRepository purchaseRepository;
    private final DocumentEventRepository documentEventRepository;
    private final FriendshipRepository friendshipRepository;

    public UserService(UserRepository userRepository,
                       PointTransactionRepository pointTransactionRepository,
                       UserBadgeRepository userBadgeRepository,
                       PurchaseRepository purchaseRepository,
                       DocumentEventRepository documentEventRepository,
                       FriendshipRepository friendshipRepository) {
        this.userRepository = userRepository;
        this.pointTransactionRepository = pointTransactionRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.purchaseRepository = purchaseRepository;
        this.documentEventRepository = documentEventRepository;
        this.friendshipRepository = friendshipRepository;
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " was not found."));
    }

    @Transactional(readOnly = true)
    public void ensureAdmin(Long userId) {
        User user = getUserById(userId);
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Only admins can perform this action.");
        }
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        User user = getUserById(userId);
        List<UserBadgeResponse> badges = userBadgeRepository.findByUserIdOrderByEarnedAtDesc(userId).stream()
                .map(GamificationMapper::toUserBadgeResponse)
                .toList();

        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCurrentPoints(),
                user.getTotalEarnedPoints(),
                userBadgeRepository.countByUserId(userId),
                documentEventRepository.countByUserId(userId),
                purchaseRepository.countByUserId(userId),
                friendshipRepository.findByUserIdAndStatus(userId, FriendshipStatus.ACCEPTED).size(),
                badges
        );
    }

    @Transactional(readOnly = true)
    public List<PointTransactionResponse> getPointHistory(Long userId) {
        getUserById(userId);
        return pointTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(GamificationMapper::toPointTransactionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserBadgeResponse> getBadges(Long userId) {
        getUserById(userId);
        return userBadgeRepository.findByUserIdOrderByEarnedAtDesc(userId).stream()
                .map(GamificationMapper::toUserBadgeResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LeaderboardEntryResponse> getLeaderboard() {
        List<User> users = userRepository.findAllByOrderByTotalEarnedPointsDescUsernameAsc();
        List<LeaderboardEntryResponse> leaderboard = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            leaderboard.add(new LeaderboardEntryResponse(
                    i + 1,
                    user.getId(),
                    user.getUsername(),
                    user.getTotalEarnedPoints(),
                    user.getCurrentPoints()
            ));
        }
        return leaderboard;
    }
}
