package mk.ukim.finki.gamification.dto.response;

public record BadgeResponse(
        Long id,
        String name,
        String description,
        Integer pointsRequired,
        String iconUrl
) {
}
