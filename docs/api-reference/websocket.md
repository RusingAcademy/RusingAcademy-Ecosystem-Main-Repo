# RusingAcademy — WebSocket API Reference

## Connection

The WebSocket server runs on the same HTTP server at path `/ws`.

### Connection URL
```
wss://www.rusingacademy.com/ws
```

### Authentication

WebSocket connections require a valid JWT token passed as a query parameter or in the `auth` handshake:

```typescript
import { io } from 'socket.io-client';

const socket = io(window.location.origin, {
  path: '/ws',
  auth: { token: sessionToken },
  transports: ['websocket', 'polling'],
});
```

### Connection Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connect` | Client | Successfully connected |
| `disconnect` | Client | Disconnected from server |
| `connect_error` | Client | Connection failed |
| `authenticated` | S→C | JWT verified, user identified |
| `auth_error` | S→C | JWT verification failed |

## Rooms

Users are automatically joined to role-based rooms upon authentication:

| Room | Pattern | Description |
|------|---------|-------------|
| Admin | `admin` | All admin users |
| Coach | `coach` | All coach users |
| Learner | `learner` | All learner users |
| HR | `hr` | All HR managers |
| User | `user:{userId}` | Individual user channel |
| Chat | `chat:{roomId}` | Chat room channel |

## Chat Events

### `chat:join`
Join a chat room to receive messages.

```typescript
socket.emit('chat:join', { roomId: 'room-123' });
```

### `chat:leave`
Leave a chat room.

```typescript
socket.emit('chat:leave', { roomId: 'room-123' });
```

### `chat:message`
Send a message to a chat room.

```typescript
// Send
socket.emit('chat:message', {
  roomId: 'room-123',
  content: 'Hello!',
  type: 'text'
});

// Receive
socket.on('chat:message', (data) => {
  console.log(data.senderId, data.content, data.timestamp);
});
```

### `chat:typing`
Send typing indicator.

```typescript
socket.emit('chat:typing', { roomId: 'room-123', isTyping: true });

socket.on('chat:typing', (data) => {
  console.log(data.userId, data.isTyping);
});
```

## Progress Events

### `progress:sync`
Sync lesson progress from client.

```typescript
socket.emit('progress:sync', {
  lessonId: 42,
  progress: 75,
  timeSpent: 120
});
```

### `progress:updated`
Server confirms progress update.

```typescript
socket.on('progress:updated', (data) => {
  console.log(data.lessonId, data.progress, data.syncVersion);
});
```

## Notification Events

### `notification:new`
Server pushes new notifications.

```typescript
socket.on('notification:new', (data) => {
  console.log(data.id, data.title, data.message, data.type);
});
```

## Broadcast Service

The server-side `broadcastService` provides methods for emitting events:

```typescript
import { broadcastService } from './websocket';

// Broadcast to a specific user
broadcastService.toUser(userId, 'notification:new', payload);

// Broadcast to a role
broadcastService.toRole('admin', 'system:alert', payload);

// Broadcast to a chat room
broadcastService.toRoom(`chat:${roomId}`, 'chat:message', payload);
```

## Feature Flag

WebSocket is controlled by the `WEBSOCKET_ENABLED` environment variable. When disabled, the server starts without Socket.io and all real-time features gracefully degrade to polling.
