import { cn } from "@/lib/utils";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import { Link } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import Image from "next/image";
import React from "react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "FAQ", href: "/faq" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: "icon-[ri--facebook-fill]" },
  { label: "Instagram", href: "https://instagram.com", icon: "icon-[radix-icons--instagram-logo]" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "icon-[radix-icons--linkedin-logo]" },
  { label: "Github", href: "https://github.com", icon: "icon-[radix-icons--github-logo]" },
];

const Footer = () => {
  return (
    <footer className="flex w-full flex-col">
      <Flex width="100%" direction="column" justify="center" align="center" px="6" py="9" gap="4">
        <Flex justify="center" align="center" gap="2">
          <Image
            alt="Logo"
            src={`/logo-transparent.png`}
            width={1000}
            height={1000}
            className="h-8 w-8"
          />
          <Text size="6" className="font-akaya_kanadaka text-accent">
            Market Hub
          </Text>
        </Flex>

        <Flex justify="center" align="center" gap="4">
          {footerLinks.map(({ label, href }) => (
            <Link key={label} href={href}>
              <Text size="2" className="text-muted-foreground">
                {label}
              </Text>
            </Link>
          ))}
        </Flex>

        <Flex justify="center" align="center" gap="4">
          {socialLinks.map(({ label, href, icon }) => (
            <Link key={label} href={href}>
              <span className={cn("h-[2rem] w-[1.5rem] text-muted-foreground", icon)}></span>
            </Link>
          ))}
        </Flex>

        <Text size="2" className="text-muted-foreground">
          &copy; {new Date().getFullYear()} Market Hub. All rights reserved.
        </Text>
      </Flex>
    </footer>
  );
};

export default Footer;
