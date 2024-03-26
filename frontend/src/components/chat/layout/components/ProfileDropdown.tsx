"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@anesok/components/ui/dropdown-menu";
import { Button } from "@anesok/components/ui/button";
import { useClerk } from "@clerk/clerk-react";
import Image from "next/image";
import { SignedOut } from "@clerk/nextjs";

export default function ProfileDropdown() {
  const { user } = useClerk();
  const TextContent = {
    profile: "حسابي",
    signOut: "تسجيل خروج",
  };

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger className="w-full">
        <Button className="h-[10%] w-full gap-x-2">
          <Image
            className="rounded-full"
            width={23}
            height={23}
            src={user?.imageUrl ?? "/icons/profile.svg"}
            alt="profile"
          />
          <h1 className="text-foreground">
            {user?.firstName + " " + user?.lastName}
          </h1>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{TextContent.profile}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant={"ghost"} className="txet-start">
            <h1 className="font-almarai">{TextContent.signOut}</h1>
            <SignedOut />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
