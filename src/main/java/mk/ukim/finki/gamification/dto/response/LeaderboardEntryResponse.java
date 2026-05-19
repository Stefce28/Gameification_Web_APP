package mk.ukim.finki.gamification.dto.response;

public record LeaderboardEntryResponse(
        Integer rank,
        Long userId,
        String username,
        Integer totalEarnedPoints,
        Integer currentPoints
) {
}
