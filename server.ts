const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const Server = require('socket.io').Server;

const dev = process.env.NODE_ENV !== 'production';
const hostname =
  process.env.NODE_ENV !== 'production'
    ? 'localhost'
    : process.env.NEXT_PUBLIC_HOSTNAME;
const port =
  process.env.NODE_ENV !== 'production' ? 3000 : process.env.NEXT_PUBLIC_PORT;
// when using middleware `hostname` and `port` must be provided below

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

interface SocketApiRequest extends Request {
  io?: typeof Server;
}

const io = new Server();
app.prepare().then(() => {
  const httpServer = createServer((req: SocketApiRequest, res: Response) => {
    req.io = io;
    handler(req, res);
  });

  io.attach(httpServer);
  //(global as any).io = io;

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
