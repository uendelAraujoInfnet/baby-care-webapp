import { supabase } from './supabaseClient';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';

// Sincronização de dados entre Supabase e LocalStorage
export const syncData = async (userId, localKey, supabaseTable) => {
  try {
    // Verificação de possível existencia de dados no LocalStorage
    let localData = getFromLocalStorage(localKey);

    if (!localData) {
      // Caso não tenha dados no LocalStorage, busca no Supabase
      const { data, error } = await supabase
        .from(supabaseTable)
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Salva no LocalStorage para futuros acessos
      saveToLocalStorage(localKey, data);
      localData = data;
    }

    return localData; // Retorna os dados sincronizados
  } catch (error) {
    console.error('Erro ao sincronizar dados:', error);
    return null; // Fallback para caso de error
  }
};
