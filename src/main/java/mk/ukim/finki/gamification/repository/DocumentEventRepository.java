package mk.ukim.finki.gamification.repository;

import mk.ukim.finki.gamification.model.entity.DocumentEvent;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface DocumentEventRepository extends JpaRepository<DocumentEvent, Long> {

    List<DocumentEvent> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<DocumentEvent> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<DocumentEvent> findByUserIdInOrderByCreatedAtDesc(Collection<Long> userIds, Pageable pageable);

    long countByUserId(Long userId);
}
