'use client';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

interface IProps {
  chatId: string;
  audio: boolean;
  video: boolean;
}

const MediaRoom: FC<IProps> = ({ audio, chatId, video }) => {
  const { user } = useUser();
  const [token, setToken] = useState();

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;
    const name = `${user?.firstName} ${user.lastName}`;
    (async () => {
      try {
        const { data } = await axios.get(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [chatId, user?.firstName, user?.lastName]);

  if (!token) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }
  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect
      video={video}
      audio={audio}
      data-lk-theme="default"
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
