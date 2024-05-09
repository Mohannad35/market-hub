"use client";

import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Skeleton } from "@nextui-org/skeleton";
import { Text } from "@radix-ui/themes";
import { CircleUserRoundIcon, LayoutDashboardIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

const NavBarAuth = () => {
  const { status, data: session } = useSession();

  if (status === "loading") return <Skeleton className="h-[2.5rem] w-[5rem] rounded-medium" />;
  else if (status === "authenticated")
    return (
      <Dropdown className="w-fit min-w-0 font-inter">
        <DropdownTrigger>
          <Avatar
            showFallback
            isBordered
            size="sm"
            radius="lg"
            ImgComponent={Image}
            imgProps={{ width: 48, height: 48 }}
            src={session.user?.image || undefined}
            alt="User avatar image"
            className="cursor-pointer"
          />
        </DropdownTrigger>
        <DropdownMenu
          hideSelectedIcon
          selectionMode="single"
          disabledKeys={["info"]}
          variant="flat"
        >
          <DropdownItem key="info">
            <Text as="p" className="font-semibold">
              Signed in as
            </Text>
            <Text className="font-semibold">{session.user?.email}</Text>
          </DropdownItem>
          <DropdownItem key="profile" startContent={<CircleUserRoundIcon size={20} />}>
            Profile
          </DropdownItem>
          <DropdownItem
            key="dashboard"
            href="/dashboard"
            startContent={<LayoutDashboardIcon size={20} />}
          >
            Dashboard
          </DropdownItem>
          <DropdownItem key="settings" showDivider startContent={<SettingsIcon size={20} />}>
            Settings
          </DropdownItem>
          <DropdownItem
            key="signout"
            color="danger"
            href="/api/auth/signout?callbackUrl=%2F"
            startContent={<LogOutIcon size={20} />}
          >
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  else if (status === "unauthenticated")
    return (
      <Button color="default" variant="light" onClick={async () => await signIn()}>
        <span className="text-medium">Sign in</span>
      </Button>
    );
};

export default NavBarAuth;
