package mk.ukim.finki.gamification.config;

import mk.ukim.finki.gamification.dto.request.CreateDocumentEventRequest;
import mk.ukim.finki.gamification.model.entity.Badge;
import mk.ukim.finki.gamification.model.entity.Friendship;
import mk.ukim.finki.gamification.model.entity.ShopItem;
import mk.ukim.finki.gamification.model.entity.User;
import mk.ukim.finki.gamification.model.enums.DocumentType;
import mk.ukim.finki.gamification.model.enums.FriendshipStatus;
import mk.ukim.finki.gamification.model.enums.ShopItemType;
import mk.ukim.finki.gamification.model.enums.UserRole;
import mk.ukim.finki.gamification.repository.BadgeRepository;
import mk.ukim.finki.gamification.repository.FriendshipRepository;
import mk.ukim.finki.gamification.repository.ShopItemRepository;
import mk.ukim.finki.gamification.repository.UserRepository;
import mk.ukim.finki.gamification.service.DocumentEventService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(UserRepository userRepository,
                               BadgeRepository badgeRepository,
                               ShopItemRepository shopItemRepository,
                               FriendshipRepository friendshipRepository,
                               DocumentEventService documentEventService) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            User admin = userRepository.save(new User("admin", "admin@gamification.local", UserRole.ADMIN));
            User professorAna = userRepository.save(new User("professor_ana", "ana@university.local", UserRole.USER));
            User studentMarko = userRepository.save(new User("student_marko", "marko@student.local", UserRole.USER));
            User studentElena = userRepository.save(new User("student_elena", "elena@student.local", UserRole.USER));

            badgeRepository.save(new Badge("First Upload", "Awarded after earning 25 total points.", 25, "/icons/first-upload.png"));
            badgeRepository.save(new Badge("Research Rookie", "Awarded after earning 100 total points.", 100, "/icons/research-rookie.png"));
            badgeRepository.save(new Badge("Knowledge Builder", "Awarded after earning 250 total points.", 250, "/icons/knowledge-builder.png"));
            badgeRepository.save(new Badge("Campus Legend", "Awarded after earning 500 total points.", 500, "/icons/campus-legend.png"));

            shopItemRepository.save(new ShopItem(
                    "Digital Certificate",
                    "Downloadable participation certificate.",
                    80,
                    100,
                    ShopItemType.DIGITAL,
                    null,
                    true
            ));
            shopItemRepository.save(new ShopItem(
                    "Campus Coffee Voucher",
                    "Physical voucher redeemable at the faculty cafe.",
                    50,
                    25,
                    ShopItemType.PHYSICAL,
                    14,
                    true
            ));
            shopItemRepository.save(new ShopItem(
                    "Priority Lab Seat",
                    "Real-life benefit for one lab session reservation.",
                    150,
                    5,
                    ShopItemType.REAL_LIFE_BENEFIT,
                    30,
                    true
            ));

            friendshipRepository.save(new Friendship(studentMarko, studentElena, FriendshipStatus.ACCEPTED));
            friendshipRepository.save(new Friendship(professorAna, studentMarko, FriendshipStatus.PENDING));

            documentEventService.createDocumentEvent(new CreateDocumentEventRequest(
                    professorAna.getId(),
                    "Machine Learning in Education",
                    DocumentType.PAPER,
                    6200,
                    "Machine Learning"
            ));
            documentEventService.createDocumentEvent(new CreateDocumentEventRequest(
                    studentMarko.getId(),
                    "Open Data Survey",
                    DocumentType.ARTICLE,
                    1800,
                    "Data Science"
            ));
            documentEventService.createDocumentEvent(new CreateDocumentEventRequest(
                    studentElena.getId(),
                    "Faculty Research Notes",
                    DocumentType.PDF,
                    900,
                    "Computer Science"
            ));
        };
    }
}
