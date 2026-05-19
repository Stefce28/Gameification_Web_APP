package mk.ukim.finki.gamification.repository;

import mk.ukim.finki.gamification.model.entity.Friendship;
import mk.ukim.finki.gamification.model.enums.FriendshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("""
            select f from Friendship f
            where ((f.requester.id = :firstUserId and f.receiver.id = :secondUserId)
                or (f.requester.id = :secondUserId and f.receiver.id = :firstUserId))
                and f.status in :statuses
            """)
    Optional<Friendship> findExistingRelationship(
            @Param("firstUserId") Long firstUserId,
            @Param("secondUserId") Long secondUserId,
            @Param("statuses") Collection<FriendshipStatus> statuses
    );

    @Query("""
            select f from Friendship f
            where (f.requester.id = :userId or f.receiver.id = :userId)
                and f.status = :status
            order by f.createdAt desc
            """)
    List<Friendship> findByUserIdAndStatus(
            @Param("userId") Long userId,
            @Param("status") FriendshipStatus status
    );
}
