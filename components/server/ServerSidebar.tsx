import React, { FC } from 'react';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import ServerHeader from './ServerHeader';

interface IServerSidebarProps {
  serverId: string;
}

const ServerSidebar: FC<IServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentProfile();
  if (!profile) return redirect('/');
  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: { orderBy: { createdAt: 'asc' } },
      members: { include: { profile: true }, orderBy: { createdAt: 'asc' } },
    },
  });
  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );
  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  if (!server) return redirect('/');
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSidebar;
