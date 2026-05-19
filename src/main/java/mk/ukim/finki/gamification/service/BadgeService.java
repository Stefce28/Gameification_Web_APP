package mk.ukim.finki.gamification.service;

import mk.ukim.finki.gamification.dto.GamificationMapper;
import mk.ukim.finki.gamification.dto.request.CreateBadgeRequest;
import mk.ukim.finki.gamification.dto.response.BadgeResponse;
import mk.ukim.finki.gamification.exception.BadRequestException;
import mk.ukim.finki.gamification.model.entity.Badge;
import mk.ukim.finki.gamification.model.entity.User;
import mk.ukim.finki.gamification.model.entity.UserBadge;
import mk.ukim.finki.gamification.repository.BadgeRepository;
import mk.ukim.finki.gamification.repository.UserBadgeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final UserService userService;

    public BadgeService(BadgeRepository badgeRepository,
                        UserBadgeRepository userBadgeRepository,
                        UserService userService) {
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.userService = userService;
    }

    @Transactional
    public BadgeResponse createBadge(Long adminUserId, CreateBadgeRequest request) {
        userService.ensureAdmin(adminUserId);
        badgeRepository.findByNameIgnoreCase(request.name())
                .ifPresent(existing -> {
                    throw new BadRequestException("A badge with this name already exists.");
                });

        Badge badge = new Badge(
                request.name().trim(),
                request.description().trim(),
                request.pointsRequired(),
                trimToNull(request.iconUrl())
        );
        return GamificationMapper.toBadgeResponse(badgeRepository.save(badge));
    }

    @Transactional(readOnly = true)
    public List<BadgeResponse> getAllBadges() {
        return badgeRepository.findByOrderByPointsRequiredAsc().stream()
                .map(GamificationMapper::toBadgeResponse)
                .toList();
    }

    @Transactional
    public List<UserBadge> unlockEligibleBadges(User user) {
        return badgeRepository.findByOrderByPointsRequiredAsc().stream()
                .filter(badge -> user.getTotalEarnedPoints() >= badge.getPointsRequired())
                .filter(badge -> !userBadgeRepository.existsByUserIdAndBadgeId(user.getId(), badge.getId()))
                .map(badge -> userBadgeRepository.save(new UserBadge(user, badge)))
                .toList();
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
