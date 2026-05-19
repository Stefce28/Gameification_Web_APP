package mk.ukim.finki.gamification.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "badges",
        uniqueConstraints = @UniqueConstraint(name = "uk_badges_name", columnNames = "name")
)
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private Integer pointsRequired;

    @Column(length = 500)
    private String iconUrl;

    protected Badge() {
    }

    public Badge(String name, String description, Integer pointsRequired, String iconUrl) {
        this.name = name;
        this.description = description;
        this.pointsRequired = pointsRequired;
        this.iconUrl = iconUrl;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Integer getPointsRequired() {
        return pointsRequired;
    }

    public String getIconUrl() {
        return iconUrl;
    }
}
