'use client';
import { ServerWithMembersAndProfile } from '@/types';
import { ChannelType, MemberRole } from '@prisma/client';
import React, { FC } from 'react';
import ActionTooltip from '../action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { useModal } from '@/hooks/useModal';

interface IProps {
  label: string;
  role?: MemberRole;
  sectionTpe: 'channels' | 'members';
  channelType?: ChannelType;
  server?: ServerWithMembersAndProfile;
}
const ServerSection: FC<IProps> = ({
  channelType,
  label,
  sectionTpe,
  role,
  server,
}) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionTpe === 'channels' && (
        <ActionTooltip label="Create channel" side="top">
          <button
            onClick={() => onOpen('createChannel', { channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionTpe === 'members' && (
        <ActionTooltip label="Manage members" side="top">
          <button
            onClick={() => onOpen('members', { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
