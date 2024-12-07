import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// FUNÇÕES PARA TRATAR A PARTE DO SUPABASE (TRABALHAR COM AS TABELAS)

// Criar um novo usuário
export const createUser = async (email, password, username, avatarUrl) => {
  // Criar o usuário na autenticação do Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error("Erro ao registrar usuário:", authError);
    return { data: null, error: authError.message };
  }

  // Verificar se o usuário foi criado
  const userId = authData.user?.id;
  if (!userId) {
    console.error("Erro ao obter ID do usuário após registro");
    return { data: null, error: "Erro ao obter ID do usuário" };
  }

  // Inserir o usuário na tabela "users"
  const { data: userData, error: dbError } = await supabase
    .from("users")
    .insert({
      id: userId, // ID do usuário gerado pelo Supabase Auth
      email,
      username,
      avatar: avatarUrl,
      created_at: new Date().toISOString(),
    })
    .select(); // Retorna os dados recém-criados

  if (dbError) {
    console.error("Erro ao salvar usuário na tabela 'users':", dbError);
    return { data: null, error: dbError.message };
  }

  return { data: userData, error: null };
};

// Obter informações da sessão do usuário
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) {
    console.error("Erro ao obter sessão:", error || "Sessão ausente");
    return null;
  }
  return data.session;
};


// Login do usuário
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Erro ao fazer login:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

// Adicionar uma nova entrada no histórico
export const addEntry = async (type, data, userId) => {
  const { data: result, error } = await supabase
    .from('entries')
    .insert([{ type, data, timestamp: new Date().toISOString(), user_id: userId }])
    .select();

  return { result, error };
};

// Obter histórico de entradas
export const getEntries = async () => {
  const session = await getSession();
  if (!session || !session.user) {
    console.error("Erro: Usuário não autenticado ou sessão ausente!", session);
    return { data: null, error: "Usuário não autenticado ou sessão ausente!" };
  }

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", session.user.id)
    .order("timestamp", { ascending: false });

  return { data, error };
};

// Salvar dados na tabela "entries"
export const saveEntry = async (type, data) => {
  const { data: session } = await supabase.auth.getSession();

  if (!session?.user) {
    console.error("Usuário não autenticado!");
    return { error: "Usuário não autenticado!" };
  }

  const { data: result, error } = await supabase
    .from("entries")
    .insert([
      {
        user_id: session.user.id,
        type,
        data,
        timestamp: new Date().toISOString(),
      },
    ]);

  if (error) {
    console.error("Erro ao salvar entrada:", error);
    return { error };
  }

  return { result };
};

// Adicionar ou atualizar informações do bebê
export const addBabyData = async (babyInfo) => {
  const session = await getSession();
  if (!session || !session.user) {
    console.error("Erro: Usuário não autenticado ou sessão ausente!");
    return { data: null, error: "Usuário não autenticado ou sessão ausente!" };
  }

  const { data, error } = await supabase
    .from("baby_data")
    .upsert({
      user_id: session.user.id,
      name: babyInfo.name,
      weight: babyInfo.weight,
      length: babyInfo.length,
      birth_date: babyInfo.birthDate,
      diseases: babyInfo.diseases,
    })
    .select();

  return { data, error };
};

// Obter informações do bebê
export const getBabyData = async () => {
  const session = await getSession();
  if (!session || !session.user) {
    console.error("Sessão inválida ou usuário não autenticado.");
    return { data: null, error: "Sessão inválida ou usuário não autenticado." };
  }

  const { data, error } = await supabase
    .from("baby_data")
    .select("*")
    .eq("user_id", session.user.id)
    .single(); // Garante que apenas um registro será retornado

    if (error) {
      if (error.code === "PGRST116") {
        console.warn("Nenhum dado encontrado para o usuário.");
        return { data: null, error: "Nenhum dado encontrado." };
      }
      console.error("Erro ao obter dados do bebê:", error.message);
      return { data: null, error: error.message };
    }
  
    return { data, error: null };
};

// Salvar informações do bebê
export const saveBabyData = async (babyInfo) => {
  const session = await getSession();
  if (!session || !session.user) {
    console.error("Erro: Usuário não autenticado ou sessão ausente!");
    return { data: null, error: "Usuário não autenticado ou sessão ausente!" };
  }

  const { data, error } = await supabase
    .from("baby_data")
    .upsert({
      user_id: session.user.id,
      name: babyInfo.name,
      weight: babyInfo.weight,
      length: babyInfo.length,
      birth_date: babyInfo.birthDate,
      diseases: babyInfo.diseases,
    })
    .select();

  return { data, error };
};
