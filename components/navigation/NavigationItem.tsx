"use client";
import React, { FC } from "react";
import ActionTooltip from "../action-tooltip";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface INavigationItem {
  id: string;
  imageUrl: string;
  name: string;
}

const NavigationItem: FC<INavigationItem> = ({ id, imageUrl, name }) => {
  const params = useParams();
  const router = useRouter();
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button className="group relative flex items-center" onClick={()=>router.push(`/servers/${id}`)}>
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        >
        </div>
            <div className={cn("relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden", params?.serverId===id && "bg-primary/10 text-primary rounded-[16px]")}>
                <Image fill src={imageUrl} alt="channel-icon" className="object-cover" />
            </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
