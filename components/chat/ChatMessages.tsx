'use client';
import { Member, Message, Profile } from '@prisma/client';
import React, { ElementRef, FC, Fragment, useRef } from 'react';
import ChatWelcome from './ChatWelcome';
import { useChatQuery } from '@/hooks/useChatQuery';
import { Loader2, ServerCrash } from 'lucide-react';
import ChatItem from './ChatItem';
import { format } from 'date-fns';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useChatScroll } from '@/hooks/useChatScroll';

interface IProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

type MessageWithMemberAndProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const ChatMessages: FC<IProps> = ({
  name,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  member,
  chatId,
  paramValue,
  type,
}) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });
  if (status === 'pending') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages
        </p>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
      {!hasNextPage && (
        <>
          <div className="flex-1" />
          <ChatWelcome type={type} name={name} />
        </>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-50 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, idx) => (
          <Fragment key={idx}>
            {group.items.map((msg: MessageWithMemberAndProfile) => (
              <ChatItem
                key={msg.id}
                id={msg.id}
                currentMember={member}
                member={msg.member}
                content={msg.content}
                fileUrl={msg.fileUrl}
                deleted={msg.deleted}
                timestamp={format(new Date(msg.createdAt), 'd MMM yyyy, HH:mm')}
                isUpdated={msg.updatedAt !== msg.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
