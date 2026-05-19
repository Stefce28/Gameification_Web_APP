# Gamification Rewards Backend

Spring Boot REST API for a gamification/reward module that will later integrate with a student/professor crowdsourcing app.

## Run

In IntelliJ IDEA, open this folder as a Maven project and run:

- `mk.ukim.finki.gamification.GamificationRewardsApplication`

From a terminal with Maven on `PATH`:

```powershell
mvn spring-boot:run
```

H2 console:

- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:gamificationdb`
- User: `sa`
- Password: empty

## Admin Calls

There is no Spring Security yet. Admin-only endpoints use a simple header:

```http
X-User-Id: 1
```

The sample `admin` user is seeded first, so it is usually id `1` in the development H2 database.

## Integration Placeholder

The future crowdsourcing/upload application should call:

```http
POST /api/document-events
```

after it validates and stores a scientific document. For now this endpoint simulates upload events and awards points.

Example:

```json
{
  "userId": 2,
  "title": "AI Methods in Education",
  "documentType": "PAPER",
  "fileSizeKb": 5300,
  "scientificField": "Artificial Intelligence"
}
```

## Main Endpoints

- `POST /api/document-events`
- `GET /api/users/{id}/profile`
- `GET /api/users/{id}/points/history`
- `GET /api/users/{id}/badges`
- `GET /api/users/{id}/document-events`
- `GET /api/leaderboard`
- `GET /api/shop/items`
- `POST /api/shop/items`
- `PUT /api/shop/items/{id}`
- `DELETE /api/shop/items/{id}`
- `POST /api/shop/purchase`
- `GET /api/users/{id}/purchases`
- `POST /api/friends/request`
- `POST /api/friends/{requestId}/accept`
- `POST /api/friends/{requestId}/reject`
- `GET /api/users/{id}/friends`
- `GET /api/feed`
- `GET /api/feed/friends/{userId}`
- `POST /api/badges`
- `GET /api/badges`
