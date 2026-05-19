package mk.ukim.finki.gamification.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import mk.ukim.finki.gamification.model.enums.DocumentType;

import java.time.LocalDateTime;

@Entity
@Table(name = "document_events")
public class DocumentEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DocumentType documentType;

    @Column(nullable = false)
    private Integer fileSizeKb;

    @Column(nullable = false, length = 120)
    private String scientificField;

    @Column(nullable = false)
    private Integer pointsAwarded;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected DocumentEvent() {
    }

    public DocumentEvent(User user, String title, DocumentType documentType, Integer fileSizeKb,
                         String scientificField, Integer pointsAwarded) {
        this.user = user;
        this.title = title;
        this.documentType = documentType;
        this.fileSizeKb = fileSizeKb;
        this.scientificField = scientificField;
        this.pointsAwarded = pointsAwarded;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getTitle() {
        return title;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public Integer getFileSizeKb() {
        return fileSizeKb;
    }

    public String getScientificField() {
        return scientificField;
    }

    public Integer getPointsAwarded() {
        return pointsAwarded;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
