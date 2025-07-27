"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { AuthService } from '../app/auth-service';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleMenuClose = () => setMenuOpen(false);

  const handleSignOut = async () => {
    await AuthService.logout();
    router.push('/');
  }

  return (
    <nav className="h-[6vh] bg-blue-600 p-4 max-w-screen w-full">
      
      <div className="container mx-auto flex items-center justify-between">
        
        <div className="text-white font-bold text-xl">Take My Pack Dude</div>
        
        {/* Burger button for mobile */}
        <button
          className="text-white text-3xl md:hidden focus:outline-none"
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          &#9776;
        </button>
        
        {/* Menu */}
        <ul
          className={`flex flex-col md:flex-row md:space-x-6 md:static absolute left-0 right-0 top-[6vh] bg-blue-600 md:bg-transparent z-50 transition-all duration-200
          ${menuOpen ? 'block' : 'hidden'} md:flex`}
        >

          <li>

            <Link href="/" className="block px-4 py-2 text-white hover:text-blue-200" onClick={handleMenuClose}>
              Home
            </Link>

          </li>

          {session?.user ? (
            
            <li>

              <Link href="/profile" className="block px-4 py-2 text-white hover:text-blue-200" onClick={handleMenuClose}>
                {session.user.name}
              </Link>
              <button className="block px-4 py-2 text-white hover:text-blue-200" onClick={handleSignOut}>
                Sign Out
              </button>

            </li>

          ) : (
            <>
              <li>
                <Link href="/signup" className="block px-4 py-2 text-white hover:text-blue-200" onClick={handleMenuClose}>
                  Sign Up
                </Link>
              </li>

              <li>
                <Link href="/signin" className="block px-4 py-2 text-white hover:text-blue-200" onClick={handleMenuClose}>
                  Sign In
                </Link>
              </li>
            </>
          )}

        </ul>

      </div>

    </nav>
  );
}