'use client';

import { useEffect, useState } from 'react';
import CreateServerModal from '../modals/createServerModal';
import InviteModal from '../modals/InviteModal';
import EditServerModal from '../modals/editServerModal';
import MembersModal from '../modals/membersModal';
import CreateChannelModal from '../modals/createChannelModal';
import LeaveServerModal from '../modals/LeaveServerModal';
import DeleteServerModal from '../modals/DeleteServerModal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
    </>
  );
};
