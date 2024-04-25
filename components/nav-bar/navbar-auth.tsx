"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  User,
} from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { CircleUserRoundIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import Image from "next/image";

const NavBarAuth = () => {
  const { status, data: session } = useSession();

  const handleAction = async (key: string) => {
    switch (key) {
      case "profile":
        break;

      case "settings":
        break;

      case "signout":
        await signOut({ callbackUrl: "/" });
        break;

      default:
        break;
    }
  };

  if (status === "loading") return <Skeleton className="h-[2.5rem] w-[5rem] rounded-medium" />;
  else if (status === "authenticated")
    return (
      <Dropdown className="w-fit min-w-0">
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
          onAction={key => handleAction(String(key))}
          variant="flat"
        >
          <DropdownItem key="info">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{session.user?.email}</p>
          </DropdownItem>
          <DropdownItem key="profile" startContent={<CircleUserRoundIcon width={20} height={20} />}>
            Profile
          </DropdownItem>
          <DropdownItem
            key="settings"
            showDivider
            startContent={<SettingsIcon width={20} height={20} />}
          >
            Settings
          </DropdownItem>
          <DropdownItem
            key="signout"
            color="danger"
            startContent={<LogOutIcon width={20} height={20} />}
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
