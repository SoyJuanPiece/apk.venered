/*
 * Mock Supabase Client v2 (Corregido)
 * Simula la autenticación y arregla el cuelgue de la pantalla de carga.
 */

import { User, AuthSession, LoginCredentials, SignUpData } from '../types';

// --- Base de Datos y Sesión Simulada ---

const nowIso = () => new Date().toISOString();

const mockUsers: Record<string, User> = {
  'user-0123': {
    id: 'user-0123',
    email: 'demo@example.com',
    username: 'demousuario',
    display_name: 'Usuario Demo',
    bio: 'Esta es mi bio de demostracion',
    is_private: false,
    is_verified: true,
    created_at: nowIso(),
    updated_at: nowIso(),
  },
};

let currentSession: AuthSession | null = null;
let authListener: ((event: string, session: AuthSession | null) => void) | null = null;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const buildSession = (user: User): AuthSession => ({
  user,
  access_token: `mock_access_${Date.now()}`,
  refresh_token: `mock_refresh_${Date.now()}`,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
});

// Función para notificar al listener de cambios de sesión
const notifyListener = (event: string, session: AuthSession | null) => {
  currentSession = session;
  if (authListener) {
    authListener(event, currentSession);
  }
};

// --- Mock del Cliente Supabase ---

export const mockSupabase = {
  auth: {
    // LA FUNCIÓN CLAVE QUE FALTABA
    onAuthStateChange: (callback: (event: string, session: AuthSession | null) => void) => {
      authListener = callback;
      // Enviamos el estado inicial de la sesión para que la app no se cuelgue
      sleep(50).then(() => notifyListener('INITIAL_SESSION', currentSession));

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListener = null;
            },
          },
        },
      };
    },

    // Función para obtener la sesión actual, usada para restaurar
    getSession: async () => {
      await sleep(50);
      return { data: { session: currentSession }, error: null };
    },

    signInWithPassword: async (credentials: LoginCredentials) => {
      await sleep(200);
      const user = Object.values(mockUsers).find(u => u.email === credentials.email);
      
      // Usamos una contraseña genérica para el mock
      if (!user || credentials.password !== 'password123') {
        return { data: null, error: { message: 'Credenciales inválidas' } };
      }

      const session = buildSession(user);
      notifyListener('SIGNED_IN', session);
      return { data: { session }, error: null };
    },

    signOut: async () => {
      await sleep(100);
      notifyListener('SIGNED_OUT', null);
      return { error: null };
    },
    
    signUp: async (data: SignUpData) => {
      await sleep(200);
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        username: data.username || 'nuevo_usuario',
        display_name: data.display_name || 'Nuevo Usuario',
        created_at: nowIso(),
        updated_at: nowIso(),
        is_private: false,
        is_verified: false,
      };
      mockUsers[newUser.id] = newUser;
      return { data: { user: newUser, session: null }, error: null };
    },
    
    // Otras funciones simuladas que no hacen nada
    getUser: async () => ({ data: { user: currentSession?.user || null }, error: null }),
    refreshSession: async () => ({ data: { session: currentSession }, error: null }),
  },

  // Mock para consultas de base de datos (devuelve datos vacíos)
  from: (_table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
    insert: async () => ({ data: null, error: null }),
  }),
};

export default mockSupabase;
