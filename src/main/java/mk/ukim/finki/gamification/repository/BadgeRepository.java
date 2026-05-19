package mk.ukim.finki.gamification.repository;

import mk.ukim.finki.gamification.model.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BadgeRepository extends JpaRepository<Badge, Long> {

    Optional<Badge> findByNameIgnoreCase(String name);

    List<Badge> findByOrderByPointsRequiredAsc();
}
