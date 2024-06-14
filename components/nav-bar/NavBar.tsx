import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarProps } from "@nextui-org/navbar";
import { Heading } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import Search from "../product/Search";
import NavBarAuth from "./NavBarAuth";
import NavCart from "./NavCart";
import { ThemeToggle } from "./ThemeModeToggle";

export default function NavBar({ ...props }: NavbarProps) {
  return (
    <Navbar
      {...props}
      isBordered
      maxWidth="full"
      className="z-50 border-b border-black/5 font-inter dark:border-white/10 dark:bg-black/30"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "text-muted-foreground",
          "hover:text-primary",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
          "data-[active=true]:text-primary",
        ],
      }}
    >
      {/* Left side of the navbar */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {/* <NavbarMenuToggle className="md:hidden" /> */}
        <NavbarBrand as="li" className="max-w-fit gap-3">
          <Link className="flex items-center justify-start gap-1" href="/">
            <Image
              alt="Logo"
              src={`/logo-transparent.png`}
              width={1000}
              height={1000}
              className="h-10 w-10"
            />
            <Heading className="!font-akaya_kanadaka text-accent">MarketHub</Heading>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Center of the navbar */}
      <NavbarContent
        justify="center"
        className="hidden w-full max-w-[20rem] md:flex lg:max-w-[30rem]"
      >
        <Search queryName="search" api="/products" />
      </NavbarContent>

      {/* Right side of the navbar */}
      <NavbarContent justify="end" className="gap-2">
        <NavbarItem className="hidden 2xs:flex">
          <NavBarAuth />
        </NavbarItem>
        <NavCart />
        <ThemeToggle />
      </NavbarContent>

      {/* Navbar menu */}
      {/* <NavbarMenu>
        <NavbarMenuItem className="flex h-full w-full">
          <Search queryName="search" api="/products" />
        </NavbarMenuItem>
      </NavbarMenu> */}
    </Navbar>
  );
}
