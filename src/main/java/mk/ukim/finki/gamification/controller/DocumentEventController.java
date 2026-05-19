package mk.ukim.finki.gamification.controller;

import jakarta.validation.Valid;
import mk.ukim.finki.gamification.dto.request.CreateDocumentEventRequest;
import mk.ukim.finki.gamification.dto.response.DocumentEventResponse;
import mk.ukim.finki.gamification.service.DocumentEventService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/document-events")
public class DocumentEventController {

    private final DocumentEventService documentEventService;

    public DocumentEventController(DocumentEventService documentEventService) {
        this.documentEventService = documentEventService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DocumentEventResponse create(@Valid @RequestBody CreateDocumentEventRequest request) {
        return documentEventService.createDocumentEvent(request);
    }
}
