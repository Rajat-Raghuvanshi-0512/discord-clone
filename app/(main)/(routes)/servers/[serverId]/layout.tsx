import ServerSidebar from '@/components/server/ServerSidebar';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React, { FC } from 'react';

interface IServerLayoutProps {
  children: React.ReactNode;
  params: { serverId: string };
}

const ServerLayout: FC<IServerLayoutProps> = async ({ children, params }) => {
  const profile = await currentProfile();

  if (!profile) {
    auth().redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: { some: { profileId: profile?.id } },
    },
  });
  if (!server) redirect('/');
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerLayout;
