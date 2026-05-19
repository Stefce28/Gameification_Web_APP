package mk.ukim.finki.gamification.service;

import mk.ukim.finki.gamification.dto.GamificationMapper;
import mk.ukim.finki.gamification.dto.response.ActivityFeedItemResponse;
import mk.ukim.finki.gamification.repository.DocumentEventRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FeedService {

    private final DocumentEventRepository documentEventRepository;
    private final FriendService friendService;

    public FeedService(DocumentEventRepository documentEventRepository, FriendService friendService) {
        this.documentEventRepository = documentEventRepository;
        this.friendService = friendService;
    }

    @Transactional(readOnly = true)
    public List<ActivityFeedItemResponse> getGlobalFeed(int limit) {
        return documentEventRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, sanitizeLimit(limit))).stream()
                .map(GamificationMapper::toActivityFeedItemResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ActivityFeedItemResponse> getFriendsFeed(Long userId, int limit) {
        List<Long> friendIds = friendService.getAcceptedFriendIds(userId);
        if (friendIds.isEmpty()) {
            return List.of();
        }
        return documentEventRepository.findByUserIdInOrderByCreatedAtDesc(
                        friendIds,
                        PageRequest.of(0, sanitizeLimit(limit))
                ).stream()
                .map(GamificationMapper::toActivityFeedItemResponse)
                .toList();
    }

    private int sanitizeLimit(int limit) {
        return Math.max(1, Math.min(limit, 100));
    }
}
