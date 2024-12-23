import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Clock } from 'lucide-react';

type Generation = {
  id: number;
  prompt: string;
  image_url: string;
  created_at: string;
};

export function GenerationHistory() {
  const [generations, setGenerations] = useState<Generation[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setGenerations(data);
      }
    };

    fetchHistory();

    // Subscribe to new generations
    const channel = supabase
      .channel('generations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'generations' }, 
        payload => {
          setGenerations(prev => [payload.new as Generation, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6" />
        Generation History
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {generations.map((gen) => (
          <div key={gen.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={gen.image_url}
              alt={gen.prompt}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-600">{gen.prompt}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(gen.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}