import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

//FUNÇÕES PARA TRATAR A PARTE DO SUPABASE ( TRABALHAR COM AS TABELAS )
export const createUser = async (username, password) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password }])
    .select(); // Adiciona retorno explícito dos dados

  console.log('Supabase Insert Response:', { data, error });

  return { data, error };
};

export const loginUser = async (username, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

    console.log('Supabase Login Response:', { data, error });
    
  return { data, error };
};

export const addEntry = async (type, data, userId) => {
  const { data: result, error } = await supabase
    .from('entries')
    .insert([{ type, data, timestamp: new Date().toISOString(), user_id: userId }]);
  return { result, error };
};

export const getEntries = async (userId) => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });
  return { data, error };
};
