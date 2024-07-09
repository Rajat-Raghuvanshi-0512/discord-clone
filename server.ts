// server.ts

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const Server = require('socket.io').Server;

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on('connection', (socket: any) => {
    console.log('User connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  httpServer
    .once('error', (err: any) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
