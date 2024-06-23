import { create } from 'zustand';
import { Server } from '@prisma/client';

export type ModalType = 'createServer' | 'invite';

interface ModalData {
  server?: Server;
}

interface IModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
  data: ModalData;
}
export const useModal = create<IModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
