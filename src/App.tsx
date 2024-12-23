import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { ImageGenerator } from './components/ImageGenerator';
import { GenerationHistory } from './components/GenerationHistory';
import { LogOut, Sparkles } from 'lucide-react';
import { UserSession } from './lib/types';

export function App() {
  const [session, setSession] = useState<UserSession>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50">
        {session ? (
          <>
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  <h1 className="text-xl font-bold text-gray-900">AI Image Generator</h1>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-12">
                <ImageGenerator userId={session.user.id} />
                <GenerationHistory userId={session.user.id} />
              </div>
            </main>
          </>
        ) : (
          <main className="min-h-screen flex items-center justify-center px-4">
            <Auth />
          </main>
        )}
      </div>
    </>
  );
}