import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Heading } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import Search from "../product/Search";
import NavBarAuth from "./NavBarAuth";
import { ThemeToggle } from "./ThemeModeToggle";

export default function NavBar() {
  return (
    <Navbar
      isBordered
      maxWidth="full"
      className="font-inter"
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
      <NavbarBrand>
        <Link href="/" className="flex items-center gap-2">
          {/* <Logo className="h-6 w-6" /> */}
          <Image
            alt="Logo"
            src={`/logo-transparent.png`}
            width={1000}
            height={1000}
            className="h-10 w-10"
          />
          <Heading className="hidden !font-akaya_kanadaka text-accent md:flex">MarketHub</Heading>
        </Link>
      </NavbarBrand>

      {/* Center of the navbar */}
      <NavbarContent justify="center" className="hidden w-full max-w-[30rem] md:flex">
        <Search queryName="search" api="/products" />
      </NavbarContent>

      {/* Right side of the navbar */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden 2xs:flex">
          <NavBarAuth />
        </NavbarItem>
        <ThemeToggle />
      </NavbarContent>
    </Navbar>
  );
}
