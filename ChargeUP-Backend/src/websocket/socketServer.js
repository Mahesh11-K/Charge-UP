const WebSocket = require('ws');
const { Station, ChargingSession } = require('../models');

const initWebSocket = (httpServer, wsPort) => {
  let wss;

  if (wsPort) {
    try {
      wss = new WebSocket.Server({ port: wsPort });
      console.log(`⚡ Real-Time IoT & Auth Engine listening on ws://localhost:${wsPort}`);
    } catch (err) {
      console.warn(`⚠️ Dedicated WebSocket port ${wsPort} error: ${err.message}. Falling back to HTTP server.`);
      if (httpServer) {
        wss = new WebSocket.Server({ server: httpServer });
        console.log(`⚡ Real-Time IoT & Auth Engine attached to HTTP server port.`);
      }
    }
  } else if (httpServer) {
    wss = new WebSocket.Server({ server: httpServer });
    console.log(`⚡ Real-Time IoT & Auth Engine attached to HTTP server port.`);
  }

  if (!wss) return;

  wss.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const portName = wsPort ? `Port ${wsPort}` : 'HTTP Server Port';
      console.warn(`⚠️ WebSocket ${portName} in use. Sharing active HTTP server connection.`);
    } else {
      console.error('❌ WebSocket Error:', err.message);
    }
  });

  // Helper: Broadcast payload to all active clients
  const broadcast = (data, senderWs = null) => {
    const messageStr = typeof data === 'string' ? data : JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client !== senderWs && client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  };

  wss.on('connection', (ws) => {
    if (process.env.VERBOSE_WS === 'true') {
      console.log('🔌 Client / Hardware Station connected to WebSocket Engine');
    }

    ws.on('message', async (message) => {
      try {
        const payload = JSON.parse(message);

        // 1. Real-Time Authentication & Sync Events
        if (payload.type === 'AUTH_EVENT') {
          console.log(`⚡ Real-Time Auth Event: ${payload.action} for user ${payload.user?.email || 'Guest'}`);
          broadcast({
            type: 'AUTH_EVENT_BROADCAST',
            action: payload.action,
            user: payload.user,
            timestamp: new Date().toISOString()
          }, ws);
        }

        // 2. Ping / Healthcheck
        if (payload.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
        }

        // 3. Charging Station Heartbeats
        if (payload.type === 'HEARTBEAT') {
          await Station.update(
            { status: payload.status },
            { where: { stationCode: payload.stationCode } }
          );
        }

        // 4. Telemetry Stream
        if (payload.type === 'TELEMETRY') {
          const session = await ChargingSession.findByPk(payload.sessionId);
          if (session && session.status === 'IN_PROGRESS') {
            session.energyConsumedKwh = payload.energyConsumedKwh;
            await session.save();

            ws.send(JSON.stringify({
              type: 'TELEMETRY_ACK',
              sessionId: session.id,
              currentKwh: session.energyConsumedKwh
            }));
          }
        }
      } catch (err) {
        console.error('WebSocket Exception:', err.message);
      }
    });

    ws.on('close', () => {
      if (process.env.VERBOSE_WS === 'true') {
        console.log('🔌 Client / Hardware Station disconnected');
      }
    });
  });

  return wss;
};

module.exports = initWebSocket;