import React, { useState } from 'react';
import { Wand2, Download, Loader2 } from 'lucide-react';
import { generateImage } from '../services/image';
import toast from 'react-hot-toast';

interface ImageGeneratorProps {
  userId: string;
}

export function ImageGenerator({ userId }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      setLoading(true);
      const url = await generateImage(prompt, userId);
      setImageUrl(url);
      toast.success('Image generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate image');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 space-y-8">
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="w-full p-4 h-32 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Wand2 className="w-5 h-5" />
          )}
          Generate Image
        </button>
      </div>

      {imageUrl && (
        <div className="relative group">
          <img
            src={imageUrl}
            alt={prompt}
            className="w-full rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <a
              href={imageUrl}
              download
              className="p-3 bg-white rounded-full hover:bg-gray-100"
            >
              <Download className="w-6 h-6 text-gray-900" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}