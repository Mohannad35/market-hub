import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import { BugIcon, Store } from 'lucide-react';
import Link from 'next/link';
import NavBarAuth from './navbar-auth';
import NavBarLinks from './navbar-links';
import { ThemeToggle } from './ThemeModeToggle';

export default function NavBar() {
  return (
    <Navbar
      shouldHideOnScroll
      isBordered
      maxWidth='full'
      className='mb-5'
      classNames={{ wrapper: '!container' }}
    >
      {/* Left side of the navbar */}
      <NavbarBrand>
        <Link href='/' className='flex gap-2'>
          <Store size={24} className='text-accent' />
          <p className='hidden md:flex font-bold text-accent text-xl font-satisfy'>SHOPLY</p>
        </Link>
      </NavbarBrand>

      {/* Center of the navbar */}
      <NavbarContent justify='center'>
        <NavBarLinks />
      </NavbarContent>

      {/* Right side of the navbar */}
      <NavbarContent justify='end'>
        <NavbarItem className='hidden 2xs:flex'>
          <NavBarAuth />
        </NavbarItem>
        <ThemeToggle />
      </NavbarContent>
    </Navbar>
  );
}
