package mk.ukim.finki.gamification.dto.response;

import mk.ukim.finki.gamification.model.enums.DocumentType;

import java.time.LocalDateTime;

public record DocumentEventResponse(
        Long id,
        Long userId,
        String username,
        String title,
        DocumentType documentType,
        Integer fileSizeKb,
        String scientificField,
        Integer pointsAwarded,
        LocalDateTime createdAt
) {
}
