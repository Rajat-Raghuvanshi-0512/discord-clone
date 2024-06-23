'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useModal } from '@/hooks/useModal';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Copy } from 'lucide-react';

const InviteModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === 'invite';

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input className="bg-zinc-300/50 border-0" />
            <Button size={'icon'}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant={'link'}
            size={'sm'}
            className="text-xs text-zinc-500 mt-5"
          >
            Generate a new link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
