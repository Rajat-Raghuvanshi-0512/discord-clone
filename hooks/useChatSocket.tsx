import { useSocket } from '@/components/providers/socket-provider';
import { Member, Profile } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { Message } from 'postcss';
import { useEffect } from 'react';

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberAndProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  addKey,
  queryKey,
  updateKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(addKey, (message: MessageWithMemberAndProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData?.pages?.length) {
          return {
            pages: [{ items: [message] }],
          };
        }
        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };
        return { ...oldData, pages: newData };
      });
    });

    socket.on(updateKey, (message: MessageWithMemberAndProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData?.pages?.length) {
          return oldData;
        }
        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberAndProfile) =>
              item.id === message.id ? message : item
            ),
            nextCursor: page.nextCursor,
          };
        });
        return { ...oldData, pages: newData };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [addKey, queryClient, queryKey, socket, updateKey]);
};
