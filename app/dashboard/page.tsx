'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MusicIcon, UsersIcon, BookOpenIcon } from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0
  });

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Load blog stats
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, published')
        .eq('author_id', user.id);

      if (posts) {
        setStats({
          totalPosts: posts.length,
          publishedPosts: posts.filter(post => post.published).length,
          draftPosts: posts.filter(post => !post.published).length
        });
      }
    }

    loadData();
  }, []);

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Molo, {profile?.username || 'Artist'}!
        </h1>
        <p className="text-gray-400">
          Welcome to your XHAP dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Posts</h3>
            <BookOpenIcon className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalPosts}</p>
        </div>
        <div className="bg-zinc-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Published</h3>
            <MusicIcon className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.publishedPosts}</p>
        </div>
        <div className="bg-zinc-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Drafts</h3>
            <UsersIcon className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.draftPosts}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-800 rounded-lg">
            <h3 className="text-white font-medium mb-2">Write a New Story</h3>
            <p className="text-gray-400 text-sm">
              Share your thoughts and experiences with the XHAP community
            </p>
          </div>
          <div className="p-4 bg-zinc-800 rounded-lg">
            <h3 className="text-white font-medium mb-2">Update Profile</h3>
            <p className="text-gray-400 text-sm">
              Keep your profile information up to date
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}