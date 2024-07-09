'use client';
import { UploadDropzone } from '@/lib/uploadthing';
import React, { FC } from 'react';
import Image from 'next/image';
import { FileIcon, X } from 'lucide-react';

interface IFileUpload {
  onChange: (url: string) => void;
  value: string;
  endpoint: 'messageFile' | 'serverImage';
}

const FileUpload: FC<IFileUpload> = ({ onChange, endpoint, value }) => {
  const fileType = value?.split('.').pop();
  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="upload"
          className="rounded-full object-cover"
        />
        <button
          onClick={() => onChange('')}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  if (value && fileType === 'pdf') {
    return (
      <div className="relative flex items-center rounded-md bg-background/10 p-2 mt-2">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
          href={value}
          target="_blank"
          rel="noopener noreferrer"
        >
          {value}
        </a>
        <button
          onClick={() => onChange('')}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error) => {
        console.log(error);
      }}
    />
  );
};

export default FileUpload;
