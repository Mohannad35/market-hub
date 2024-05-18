"use client";

import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  DropdownSection,
} from "@nextui-org/dropdown";
import { Skeleton } from "@nextui-org/skeleton";
import { Text } from "@radix-ui/themes";
import { CircleUserRoundIcon, LayoutDashboardIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Modal from "../common/Modal";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { listItems } from "@/lib/navigation-data";
import { Icon as Iconify } from "@iconify/react";

const NavBarAuth = () => {
  const { status, data: session } = useSession();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure({});
  const [loading, setLoading] = useState(false);

  if (status === "loading") return <Skeleton className="h-[2.5rem] w-[5rem] rounded-medium" />;
  else if (status === "authenticated")
    return (
      <div className="w-fit min-w-0">
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
              <Text className="font-semibold">
                Signed in as
                <br />
                {session.user?.email}
              </Text>
            </DropdownItem>
            <DropdownSection showDivider>
              {listItems(session?.user?.username).map(({ key, label, href, icon }, i) => (
                <DropdownItem
                  key={key}
                  href={href}
                  startContent={<Iconify icon={icon} fontSize={24} />}
                >
                  {label}
                </DropdownItem>
              ))}
            </DropdownSection>

            <DropdownItem
              key="signout"
              color="danger"
              startContent={<Iconify icon="uim:signout" fontSize={24} />}
              onPress={() => onOpen()}
            >
              Sign out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Modal
          title="Sign out"
          content="Are you sure you want to sign out?"
          action="Sign out"
          onAction={async () => {
            setLoading(true);
            await signOut({ callbackUrl: "/" });
            onClose();
            setLoading(false);
          }}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isLoading={loading}
        />
      </div>
    );
  else if (status === "unauthenticated")
    return (
      <Button color="default" variant="light" onClick={async () => await signIn()}>
        <span className="text-medium">Sign in</span>
      </Button>
    );
};

export default NavBarAuth;
