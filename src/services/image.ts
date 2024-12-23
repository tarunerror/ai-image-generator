import { openai } from '../lib/openai';
import { supabase } from '../lib/supabase';

export async function generateImage(prompt: string, userId: string) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
  });

  const imageUrl = response.data[0].url;

  if (!imageUrl) {
    throw new Error('Failed to generate image');
  }

  // Save to history
  const { error } = await supabase
    .from('generations')
    .insert([{ 
      prompt, 
      image_url: imageUrl,
      user_id: userId 
    }]);

  if (error) throw error;

  return imageUrl;
}