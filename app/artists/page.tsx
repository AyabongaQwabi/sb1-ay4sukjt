import { UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ArtistsPage() {
  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1571974599782-87624638275e?auto=format&fit=crop&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Abaculi
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover Xhosa Hip Hop Artists
          </p>
        </div>
      </div>

      {/* Featured Artists Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Sipho M",
              location: "eKapa",
              image: "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?auto=format&fit=crop&q=80",
              genre: "Trap",
            },
            {
              name: "Thembi K",
              location: "eMonti",
              image: "https://images.unsplash.com/photo-1567784177951-6fa58317e16b?auto=format&fit=crop&q=80",
              genre: "Conscious Hip Hop",
            },
            {
              name: "Lundi X",
              location: "eRhawutini",
              image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80",
              genre: "Boom Bap",
            },
            {
              name: "Buhle Z",
              location: "eBhayi",
              image: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?auto=format&fit=crop&q=80",
              genre: "Alternative Hip Hop",
            },
            {
              name: "Anele M",
              location: "eKapa",
              image: "https://images.unsplash.com/photo-1520785643438-5bf77931f493?auto=format&fit=crop&q=80",
              genre: "Trap Soul",
            },
            {
              name: "Zola K",
              location: "eMonti",
              image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80",
              genre: "Gqom Rap",
            }
          ].map((artist, index) => (
            <div 
              key={index}
              className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors"
            >
              <div 
                className="h-64 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${artist.image})` }}
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-2">{artist.name}</h2>
                <p className="text-gray-400 mb-1">{artist.location}</p>
                <p className="text-red-500 text-sm mb-4">{artist.genre}</p>
                <Button asChild className="w-full">
                  <Link href={`/artists/${artist.name.toLowerCase().replace(' ', '-')}`}>
                    Jonga Iprofayile
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Join as Artist CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block p-8 bg-zinc-900 rounded-2xl">
            <UsersIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Ngumrhapi? Yiba yiNxalenye!
            </h2>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Are you a Xhosa Hip Hop artist? Join our platform to showcase your music and connect with fans.
            </p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/register">Qala Apha</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}