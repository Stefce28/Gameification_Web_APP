package mk.ukim.finki.gamification.service;

import mk.ukim.finki.gamification.model.enums.DocumentType;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Set;

@Service
public class PointCalculationService {

    private static final int BASE_UPLOAD_POINTS = 10;
    private static final Set<String> BONUS_FIELDS = Set.of(
            "artificial intelligence",
            "ai",
            "machine learning",
            "data science",
            "medicine",
            "biotechnology"
    );

    public int calculate(DocumentType documentType, int fileSizeKb, String scientificField) {
        return BASE_UPLOAD_POINTS
                + documentTypeBonus(documentType)
                + fileSizeBonus(fileSizeKb)
                + scientificFieldBonus(scientificField);
    }

    private int documentTypeBonus(DocumentType documentType) {
        return switch (documentType) {
            case PAPER -> 20;
            case ARTICLE -> 15;
            case PDF -> 5;
            case OTHER -> 3;
        };
    }

    private int fileSizeBonus(int fileSizeKb) {
        if (fileSizeKb >= 10_000) {
            return 20;
        }
        if (fileSizeKb >= 5_000) {
            return 10;
        }
        if (fileSizeKb >= 1_000) {
            return 5;
        }
        return 0;
    }

    private int scientificFieldBonus(String scientificField) {
        String normalized = scientificField.trim().toLowerCase(Locale.ROOT);
        return BONUS_FIELDS.contains(normalized) ? 10 : 0;
    }
}
