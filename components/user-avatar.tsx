import React, { FC } from 'react';
import { Avatar } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

interface IUserAvatar {
  src?: string;
  className?: string;
}

const UserAvatar: FC<IUserAvatar> = ({ src, className }) => {
  return (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};

export default UserAvatar;
