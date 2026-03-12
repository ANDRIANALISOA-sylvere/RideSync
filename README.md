# RideSync

> Real-time ride dispatch system , connecting riders and drivers instantly.

RideSync is a microservices-based backend system that handles ride requests, driver matching, and real-time location tracking. Built to explore distributed systems, event-driven architecture, and CQRS in a real-world context.

---

## The Problem

In many cities, dispatch systems are either non-existent or centralized in a single fragile server:

- No real-time visibility on driver locations
- Manual matching between riders and drivers
- No audit trail of rides
- A single crash takes down the entire system

**RideSync solves this with a distributed, event-driven architecture.**

---

## How It Works

```
1. Driver comes online       → sends location every 5s
2. Rider requests a ride     → POST /rides/request
3. System finds nearest driver → Redis Geosearch (within 3km)
4. Driver gets notified      → WebSocket
5. Driver accepts            → RideAccepted event emitted
6. Rider sees driver move    → WebSocket real-time tracking
7. Ride completes            → RideCompleted event emitted
8. Both get notified         → NotificationService
```

### What happens if driver cancels?

```
DriverCancelled event
  → Saga compensation kicks in
  → Rider is re-matched with next available driver
  → Or ride is cancelled with notification
```

---

## Architecture

```
                        ┌─────────────────┐
  Client / Driver App   │   API Gateway   │  :3000
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
    ┌─────────▼──────┐  ┌────────▼───────┐  ┌──────▼─────────┐
    │ Location       │  │ Ride           │  │ Notification   │
    │ Service  :3001 │  │ Service  :3002 │  │ Service  :3003 │
    └─────────┬──────┘  └────────┬───────┘  └──────┬─────────┘
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │       RabbitMQ          │
                    │   (Event Bus)           │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
         ┌────▼────┐       ┌─────▼─────┐      ┌────▼────┐
         │ PG DB   │       │ PG DB     │      │ PG DB   │
         │(location│       │ (rides)   │      │ (notifs)│
         └─────────┘       └───────────┘      └─────────┘
                                 │
                          ┌──────▼──────┐
                          │    Redis    │
                          │  Geo Cache  │
                          └─────────────┘
```

---

## Services

| Service                | Port | Responsibility                    |
| ---------------------- | ---- | --------------------------------- |
| `api-gateway`          | 3000 | Single entry point, routing, auth |
| `location-service`     | 3001 | Driver positions, Redis Geosearch |
| `ride-service`         | 3002 | Ride lifecycle, matching, Saga    |
| `notification-service` | 3003 | WebSocket, push notifications     |

---

## Events Flow (RabbitMQ)

```
LocationUpdated       → ride-service updates nearby drivers
RideRequested         → location-service finds nearest driver
DriverMatched         → notification-service notifies driver
RideAccepted          → notification-service notifies rider
RideCompleted         → notification-service notifies both
DriverCancelled       → ride-service triggers re-matching
```

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | NestJS                              |
| Database     | PostgreSQL + TypeORM                |
| Cache & Geo  | Redis (Geosearch)                   |
| Event Bus    | RabbitMQ                            |
| Real-time    | WebSockets (Socket.io)              |
| Containers   | Docker + Docker Compose             |
| Architecture | Microservices + CQRS + Event-Driven |

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 18+

### Clone & Run

```bash
git clone https://github.com/ANDRIANALISOA-sylvere/RideSync
cd RideSync
cp .env.example .env
docker-compose up --build
```

That's it — all services start automatically.

---

## Environment Variables

```bash
# .env

# API Gateway
API_GATEWAY_PORT=3000
JWT_SECRET=secret

# Location Service
LOCATION_SERVICE_PORT=3001
LOCATION_DB_HOST=localhost
LOCATION_DB_PORT=5432
LOCATION_DB_NAME=location_db
LOCATION_DB_USER=postgres
LOCATION_DB_PASSWORD=postgres

# Ride Service
RIDE_SERVICE_PORT=3002
RIDE_DB_HOST=localhost
RIDE_DB_PORT=5432
RIDE_DB_NAME=ride_db
RIDE_DB_USER=postgres
RIDE_DB_PASSWORD=postgres

# Notification Service
NOTIFICATION_SERVICE_PORT=3003
NOTIFICATION_DB_HOST=localhost
NOTIFICATION_DB_PORT=5432
NOTIFICATION_DB_NAME=notification_db
NOTIFICATION_DB_USER=postgres
NOTIFICATION_DB_PASSWORD=postgres

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## API Endpoints

### Auth (via API Gateway)

```bash
POST /auth/register    # Register as rider or driver
POST /auth/login       # Login → JWT token
```

### Rides

```bash
POST /rides/request              # Rider requests a ride
GET  /rides/:id                  # Get ride status
POST /rides/:id/accept           # Driver accepts
POST /rides/:id/cancel           # Driver or rider cancels
POST /rides/:id/complete         # Driver completes ride
GET  /rides/history              # Ride history
```

### Location

```bash
POST /location/update            # Driver sends position
GET  /location/drivers/nearby    # Rider sees nearby drivers
```

### WebSocket Events

```bash
# Connect
ws://localhost:3000?token=<jwt>

# Listen
ride:matched          → driver found for your request
ride:driver-location  → driver position update (real-time)
ride:accepted         → driver accepted your ride
ride:completed        → ride is done
ride:cancelled        → ride was cancelled

# Emit
location:update       → driver sends { lat, lng }
```

---

## CQRS in Action

```
COMMAND side (writes)           QUERY side (reads)
─────────────────────           ──────────────────
POST /rides/request             GET /rides/:id
POST /location/update           GET /location/drivers/nearby
POST /rides/:id/accept          GET /rides/history

Writes → PostgreSQL (source of truth)
Reads  → Redis cache (fast, scalable)
```

---

## Saga Pattern — Ride Cancellation

```
Happy path:
  RideRequested → DriverMatched → RideAccepted → RideCompleted

Compensation (driver cancels):
  DriverCancelled
    → Mark ride as "searching again"
    → Find next available driver
    → Notify rider: "Finding another driver..."
    → If no driver found in 2 min → RideCancelled
```

---

## Concepts Applied

- **Microservices** — each service is independent, deployable separately
- **CQRS** — separate read and write models
- **Event-Driven Architecture** — services communicate via RabbitMQ events
- **Saga Pattern** — distributed transaction compensation
- **Redis Geosearch** — find drivers within X km radius
- **WebSockets** — real-time location updates
- **Docker Compose** — orchestrate all services locally

---

<!--
## Roadmap

- [ ] Surge pricing based on demand
- [ ] Driver rating system
- [ ] Trip analytics
- [ ] CI/CD GitHub Actions
-->

---

## Author

**Sylvère Andrianalisoa** — [@ANDRIANALISOA-sylvere](https://github.com/ANDRIANALISOA-sylvere)

> Built to master distributed systems. Inspired by real transport challenges.
