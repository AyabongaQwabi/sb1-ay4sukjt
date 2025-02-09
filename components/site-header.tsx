'use client';

import Link from 'next/link';
import { MusicIcon, MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSupabase } from '@/components/providers/supabase-provider';

function Navigation({ className = "" }: { className?: string }) {
  return (
    <nav className={`space-x-6 ${className}`}>
      <Link href="/" className="hover:text-red-500 transition-colors">Ikhaya</Link>
      <Link href="/about" className="hover:text-red-500 transition-colors">Malunga Nathi</Link>
      <Link href="/blog" className="hover:text-red-500 transition-colors">Amabali</Link>
      <Link href="/artists" className="hover:text-red-500 transition-colors">Abaculi</Link>
      <Link href="/events" className="hover:text-red-500 transition-colors">Iziganeko</Link>
      <Link href="/contact" className="hover:text-red-500 transition-colors">Qhagamshelana</Link>
    </nav>
  );
}

export function SiteHeader() {
  const { user, loading } = useSupabase();

  return (
    <header className="fixed w-full z-50 bg-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MusicIcon className="h-6 w-6 text-red-600" />
          <span className="text-2xl font-bold">X<span className="text-red-600">HAP</span></span>
        </div>
        
        <Navigation className="hidden md:block text-sm text-white" />
        
        <div className="hidden md:flex items-center space-x-4">
          {!loading && (
            user ? (
              <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Ngena</Link>
                </Button>
                <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                  <Link href="/register">Qala Apha</Link>
                </Button>
              </>
            )
          )}
        </div>

        <Sheet>
          <SheetTrigger className="md:hidden">
            <MenuIcon className="h-6 w-6 text-white" />
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col space-y-4 mt-8">
              <Navigation className="flex flex-col space-y-4" />
              <hr className="border-zinc-800" />
              {!loading && (
                user ? (
                  <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/login">Ngena</Link>
                    </Button>
                    <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                      <Link href="/register">Qala Apha</Link>
                    </Button>
                  </>
                )
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}