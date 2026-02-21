import supabase from '../supabase/client';
import { LoginCredentials, SignUpData, AuthSession } from '../types';

/**
 * AuthService v2 (Simplificado)
 * Confía en el cliente de Supabase (real o mock) para gestionar la sesión.
 * No más manejo manual con AsyncStorage.
 */
export class AuthService {
  /**
   * Registra un nuevo usuario.
   */
  static async signUp(data: SignUpData): Promise<void> {
    // La lógica de signUp no necesita cambiar significativamente.
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          display_name: data.display_name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Inicia sesión.
   */
  static async signIn(credentials: LoginCredentials): Promise<AuthSession> {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      throw new Error(error.message || 'Credenciales inválidas');
    }
    if (!data.session) {
      throw new Error('No se pudo iniciar sesión.');
    }

    // El listener onAuthStateChange se encargará del resto.
    return data.session;
  }

  /**
   * Cierra la sesión.
   */
  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    // El listener onAuthStateChange se encargará del resto.
  }

  /**
   * Restaura la sesión al iniciar la app.
   * Esta es la forma correcta de hacerlo.
   */
  static async restoreSession(): Promise<AuthSession | null> {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error restoring session:', error);
      return null;
    }

    // Devuelve la sesión que el cliente Supabase tiene en memoria.
    return data.session;
  }

  // El resto de funciones de ayuda se pueden mantener si son necesarias,
  // pero el manejo manual de la sesión (saveSession, handleError) ya no es necesario
  // o debe ser adaptado.
}

export default AuthService;
