package mk.ukim.finki.gamification.repository;

import mk.ukim.finki.gamification.model.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {

    boolean existsByUserIdAndBadgeId(Long userId, Long badgeId);

    List<UserBadge> findByUserIdOrderByEarnedAtDesc(Long userId);

    long countByUserId(Long userId);
}
