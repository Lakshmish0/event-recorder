package com.vbs.event_recorder.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * EventBroadcaster manages active SSE client connections and broadcasts
 * event state changes (CREATED, UPDATED, DELETED) and heartbeats.
 * 
 * Note on scaling:
 * Single-instance assumption: scaling beyond one instance would require a shared broker
 * (such as Redis Pub/Sub, RabbitMQ, or NATS) to synchronize broadcasts across nodes.
 */
@Component
public class EventBroadcaster {

    private static final Logger log = LoggerFactory.getLogger(EventBroadcaster.class);

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    /**
     * Registers a new SseEmitter without timeout (0L), keeping connection alive.
     */
    public SseEmitter createEmitter() {
        // 0L means no timeout in Spring SseEmitter
        SseEmitter emitter = new SseEmitter(0L);

        emitter.onCompletion(() -> {
            log.debug("SSE emitter completed");
            this.emitters.remove(emitter);
        });
        emitter.onTimeout(() -> {
            log.debug("SSE emitter timed out");
            this.emitters.remove(emitter);
        });
        emitter.onError(e -> {
            log.debug("SSE emitter error: {}", e.getMessage());
            this.emitters.remove(emitter);
        });

        this.emitters.add(emitter);
        log.info("Registered new SSE client emitter. Total active clients: {}", emitters.size());
        return emitter;
    }

    /**
     * Broadcasts event change notifications to all connected clients.
     * Drops dead emitters on sending failure.
     */
    public void broadcast(String type, Object payload) {
        if (emitters.isEmpty()) {
            return;
        }

        Map<String, Object> dataPayload = Map.of(
            "type", type,
            "event", payload,
            "timestamp", Instant.now().toString()
        );

        List<SseEmitter> deadEmitters = new ArrayList<>();

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                    .name("event-change")
                    .data(dataPayload));
            } catch (Exception e) {
                log.debug("Failed to send SSE payload to client, queueing for removal: {}", e.getMessage());
                deadEmitters.add(emitter);
            }
        }

        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
            log.info("Removed {} disconnected SSE emitters. Remaining: {}", deadEmitters.size(), emitters.size());
        }
    }

    /**
     * Heartbeat / ping event sent every 25 seconds to keep idle connections open
     * across proxies, load balancers, and browsers.
     */
    @Scheduled(fixedRate = 25000)
    public void sendPing() {
        if (emitters.isEmpty()) {
            return;
        }

        List<SseEmitter> deadEmitters = new ArrayList<>();

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                    .name("ping")
                    .data("ping"));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }

        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
        }
    }

    public int getActiveClientCount() {
        return emitters.size();
    }
}
