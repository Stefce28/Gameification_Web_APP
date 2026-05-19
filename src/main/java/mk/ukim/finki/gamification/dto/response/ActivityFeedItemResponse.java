package mk.ukim.finki.gamification.dto.response;

import mk.ukim.finki.gamification.model.enums.DocumentType;

import java.time.LocalDateTime;

public record ActivityFeedItemResponse(
        Long eventId,
        UserSummaryResponse user,
        String title,
        DocumentType documentType,
        String scientificField,
        Integer pointsAwarded,
        LocalDateTime createdAt
) {
}
