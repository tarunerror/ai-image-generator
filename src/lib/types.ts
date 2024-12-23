import { Session } from '@supabase/supabase-js';

export type UserSession = Session | null;

export interface Generation {
  id: number;
  user_id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}