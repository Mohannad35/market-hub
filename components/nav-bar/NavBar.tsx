import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Store } from "lucide-react";
import Link from "next/link";
import NavBarAuth from "./navbar-auth";
import NavBarLinks from "./navbar-links";
import { ThemeToggle } from "./ThemeModeToggle";
import { Heading, Text } from "@radix-ui/themes";

export default function NavBar() {
  return (
    <Navbar
      shouldHideOnScroll
      isBordered
      maxWidth="full"
      className="mb-5 font-inter"
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
        <Link href="/" className="flex gap-2">
          <Store size={24} className="text-accent" />
          <Heading className="hidden !font-satisfy text-accent md:flex">MarketHub</Heading>
        </Link>
      </NavbarBrand>

      {/* Center of the navbar */}
      <NavbarContent justify="center">
        <NavBarLinks />
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
