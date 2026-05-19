package mk.ukim.finki.gamification.repository;

import mk.ukim.finki.gamification.model.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    List<Purchase> findByUserIdOrderByPurchasedAtDesc(Long userId);

    long countByUserId(Long userId);
}
