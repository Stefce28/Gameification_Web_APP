package mk.ukim.finki.gamification.dto.response;

public record UserSummaryResponse(
        Long id,
        String username,
        String email
) {
}
