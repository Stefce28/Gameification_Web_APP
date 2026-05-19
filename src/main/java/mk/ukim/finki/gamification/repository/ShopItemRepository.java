package mk.ukim.finki.gamification.repository;

import mk.ukim.finki.gamification.model.entity.ShopItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShopItemRepository extends JpaRepository<ShopItem, Long> {

    List<ShopItem> findByActiveTrueOrderByNameAsc();
}
