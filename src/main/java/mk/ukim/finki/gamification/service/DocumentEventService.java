package mk.ukim.finki.gamification.service;

import mk.ukim.finki.gamification.dto.GamificationMapper;
import mk.ukim.finki.gamification.dto.request.CreateDocumentEventRequest;
import mk.ukim.finki.gamification.dto.response.DocumentEventResponse;
import mk.ukim.finki.gamification.model.entity.DocumentEvent;
import mk.ukim.finki.gamification.model.entity.PointTransaction;
import mk.ukim.finki.gamification.model.entity.User;
import mk.ukim.finki.gamification.model.enums.TransactionType;
import mk.ukim.finki.gamification.repository.DocumentEventRepository;
import mk.ukim.finki.gamification.repository.PointTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentEventService {

    private final DocumentEventRepository documentEventRepository;
    private final PointTransactionRepository pointTransactionRepository;
    private final UserService userService;
    private final PointCalculationService pointCalculationService;
    private final BadgeService badgeService;

    public DocumentEventService(DocumentEventRepository documentEventRepository,
                                PointTransactionRepository pointTransactionRepository,
                                UserService userService,
                                PointCalculationService pointCalculationService,
                                BadgeService badgeService) {
        this.documentEventRepository = documentEventRepository;
        this.pointTransactionRepository = pointTransactionRepository;
        this.userService = userService;
        this.pointCalculationService = pointCalculationService;
        this.badgeService = badgeService;
    }

    @Transactional
    public DocumentEventResponse createDocumentEvent(CreateDocumentEventRequest request) {
        User user = userService.getUserById(request.userId());
        int pointsAwarded = pointCalculationService.calculate(
                request.documentType(),
                request.fileSizeKb(),
                request.scientificField()
        );

        // Integration point: the crowdsourcing upload app can call this method or REST endpoint
        // after it validates and stores a scientific document.
        DocumentEvent documentEvent = new DocumentEvent(
                user,
                request.title().trim(),
                request.documentType(),
                request.fileSizeKb(),
                request.scientificField().trim(),
                pointsAwarded
        );

        user.addEarnedPoints(pointsAwarded);
        documentEventRepository.save(documentEvent);
        pointTransactionRepository.save(new PointTransaction(
                user,
                pointsAwarded,
                TransactionType.EARNED,
                "Document upload: " + request.title().trim()
        ));
        badgeService.unlockEligibleBadges(user);

        return GamificationMapper.toDocumentEventResponse(documentEvent);
    }

    @Transactional(readOnly = true)
    public List<DocumentEventResponse> getDocumentEventsForUser(Long userId) {
        userService.getUserById(userId);
        return documentEventRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(GamificationMapper::toDocumentEventResponse)
                .toList();
    }
}
