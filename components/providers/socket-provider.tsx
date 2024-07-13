'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { io as ClientIO, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: null,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const values = useMemo(() => {
    return { isConnected, socket };
  }, [isConnected, socket]);

  useEffect(() => {
    const socketInstance = ClientIO(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    );
    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    });
    socketInstance.on('disconnect', () => {
      console.log('Disconnected');
      setIsConnected(false);
    });

    setSocket(socketInstance as any);
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
