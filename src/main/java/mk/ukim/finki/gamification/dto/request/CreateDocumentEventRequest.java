package mk.ukim.finki.gamification.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import mk.ukim.finki.gamification.model.enums.DocumentType;

public record CreateDocumentEventRequest(
        @NotNull Long userId,
        @NotBlank @Size(max = 200) String title,
        @NotNull DocumentType documentType,
        @NotNull @Positive Integer fileSizeKb,
        @NotBlank @Size(max = 120) String scientificField
) {
}
