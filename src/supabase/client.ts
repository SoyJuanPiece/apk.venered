import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from '../__mocks__/supabase';

// --- FORZANDO MODO SIMULADO ---
// Se ha eliminado la lógica de variables de entorno para usar siempre el cliente simulado.

console.log('⚠️  Forzando MODO SIMULADO. Usando MOCK Supabase client.');
const supabase: any = mockSupabase;

// --- FIN DEL CAMBIO ---

// El resto de las funciones de ayuda se mantienen igual.
export const isSupabaseConfigured = (): boolean => false; // Siempre devuelve false.

export const handleSupabaseError = (
  error: any,
  fallbackMessage: string = 'Algo salió mal'
): string => {
  if (!error) return fallbackMessage;

  if (error.message) {
    return error.message;
  }

  if (error.status === 401) {
    return 'No autorizado. Por favor, inicia sesión nuevamente.';
  }

  if (error.status === 404) {
    return 'Recurso no encontrado.';
  }

  if (error.status >= 500) {
    return 'Error del servidor. Intenta más tarde.';
  }

  return fallbackMessage;
};

export default supabase;
