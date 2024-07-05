'use client';
import { useState } from 'react';

import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useModal } from '@/hooks/useModal';
import { Button } from '../ui/button';
import { redirect, useRouter } from 'next/navigation';
import qs from 'query-string';

const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [loading, setLoading] = useState(false);
  const { server, channel } = data;
  const router = useRouter();
  const isModalOpen = isOpen && type === 'deleteChannel';

  const onClick = async () => {
    try {
      setLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.delete(url);
      router.refresh();
      onClose();
      redirect(`/servers/${server?.id}/`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to continue? <br />
            <span className="font-semibold text-indigo-500">
              #{channel?.name}
            </span>{' '}
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <Button disabled={loading} variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={loading} variant="primary" onClick={onClick}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
